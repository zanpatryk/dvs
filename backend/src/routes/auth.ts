import { Hono } from "hono";
import { v4 as uuid } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { hashMessage, recoverAddress } from "ethers";
import { db } from "../db";
import { noncesTable } from "../db/schema/nonces";
import { and, eq } from "drizzle-orm";
import { sessionsTable } from "../db/schema/sessions";
import { refreshTokensTable } from "../db/schema/refresh-tokens";
import { sign, verify, type JwtVariables } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";

const ACCESS_TOKEN_EXP = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXP = 7 * 24 * 3600; // 7 days
const NONCE_EXP = 60 * 60 * 1000;
const COOKIE_OPTIONS: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "Strict",
	//prefix: "host",
	path: "/",
};
const addressSchema = z
	.string()
	.length(42)
	.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

const authSchema = z.object({
	address: addressSchema,
	signature: z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid signature"),
});

const JwtPayloadSchema = z.object(
	{
		sub: addressSchema,
		sid: z.string().uuid(),
		jti: z.string().uuid(),
		exp: z.number().optional(),
		iat: z.number().optional(),
		nbf: z.number().optional(),
	},
	{ message: "Invalid payload structure" }
);

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export type Variables = JwtVariables<JwtPayload>;

export const meRoute = new Hono<{ Variables: Variables }>().get("/", (c) => {
	const payload = c.get("jwtPayload");
	return c.json({ address: payload.sub });
});

export const authRoute = new Hono<{ Variables: Variables }>()
	.get("/nonce/:address", async (c) => {
		const result = addressSchema.safeParse(c.req.param("address"));
		if (!result.success) {
			return c.json({ error: result.error }, 400);
		}

		const address = result.data.toLowerCase();

		const existing = await db
			.select()
			.from(noncesTable)
			.where(eq(noncesTable.address, address))
			.limit(1)
			.then((res) => res[0]);

		let nonce: string;

		if (existing && new Date(existing.expiresAt) > new Date()) {
			nonce = existing.nonce;
		} else {
			nonce = uuid();
			const expiresAt = new Date(Date.now() + NONCE_EXP); // valid for 1 hr

			await db
				.insert(noncesTable)
				.values({
					address,
					nonce,
					expiresAt,
				})
				.onConflictDoUpdate({
					target: noncesTable.address,
					set: {
						nonce,
						expiresAt,
					},
				});
		}

		return c.json({ nonce });
	})
	.post("/login", zValidator("json", authSchema), async (c) => {
		const { address, signature } = c.req.valid("json");

		const addr = address.toLowerCase();

		// 1) Fetch nonce
		const record = await db
			.select()
			.from(noncesTable)
			.where(eq(noncesTable.address, addr))
			.limit(1)
			.then((res) => res[0]);
		if (!record) return c.json({ error: "Nonce not found" }, 400);

		const nonce = record.nonce;

		if (new Date(record.expiresAt) < new Date()) {
			return c.json({ error: "Nonce expired" }, 400);
		}

		// 2) Verify signature (EIP-191 personal_sign)
		const msgHash = hashMessage(nonce); // adds "\x19Ethereum Signed Message:\n"
		const recovered = recoverAddress(msgHash, signature); // recovered is checksummed address
		if (recovered.toLowerCase() !== addr) {
			return c.json({ error: "Signature verification failed" }, 401);
		}

		// 3) Authenticated: create session & refresh token record
		const newSession = await db
			.insert(sessionsTable)
			.values({ address: addr })
			.returning()
			.then((res) => res[0]);

		if (!newSession) {
			return c.json(
				{ error: "Error creating session & refresh token record" },
				400
			);
		}

		const sessionId = newSession.id;
		// const refreshId = crypto.randomUUID(); // JWT ID for rotation tracking
		const refreshId = uuid(); // JWT ID for rotation tracking
		const refreshExpires = new Date(Date.now() + REFRESH_TOKEN_EXP * 1000);

		await db.insert(refreshTokensTable).values({
			id: refreshId,
			sessionId: sessionId,
			expiresAt: refreshExpires,
			revoked: false,
		});

		// 4) Issue JWTs (signed with secret)
		const accessToken = await sign(
			{ sub: addr, exp: Date.now() + ACCESS_TOKEN_EXP },
			process.env.JWT_SECRET!
		);
		const refreshToken = await sign(
			{
				sub: addr,
				sid: sessionId,
				jti: refreshId,
				exp: Date.now() + REFRESH_TOKEN_EXP,
			},
			process.env.JWT_SECRET!
		);

		// 5) Set cookies with appropriate flags (HttpOnly, Secure, SameSite=Strict, __Host- prefix)
		setCookie(c, "access_token", accessToken, {
			...COOKIE_OPTIONS,
			maxAge: ACCESS_TOKEN_EXP,
		});
		setCookie(c, "refresh_token", refreshToken, {
			...COOKIE_OPTIONS,
			maxAge: REFRESH_TOKEN_EXP,
		});

		// 6) Rotate nonce to a new value (invalidate old signature):contentReference[oaicite:15]{index=15}
		const newNonce = uuid();
		const newExpiry = new Date(Date.now() + NONCE_EXP);
		await db
			.update(noncesTable)
			.set({ nonce: newNonce, expiresAt: newExpiry })
			.where(eq(noncesTable.address, addr));

		return c.json({ message: "Login successful" }, 201);
	})
	.post("/refresh", async (c) => {
		// 1) Read refresh token from cookie
		// const refreshToken = getCookie(c, "refresh_token", "host"); // __Host-refresh_token cookie
		const refreshToken = getCookie(c, "refresh_token"); // __Host-refresh_token cookie
		if (!refreshToken) {
			return c.json({ error: "Refresh token missing" }, 401);
		}

		// 2) Verify JWT and payload
		let payload: unknown;
		try {
			payload = await verify(refreshToken, process.env.JWT_SECRET!);
		} catch {
			return c.json({ error: "Invalid refresh token" }, 401);
		}
		const result = JwtPayloadSchema.safeParse(payload);

		if (!result.success) {
			return c.json({ error: result.error }, 400);
		}
		const { sub: addr, sid: sessionId, jti: oldRefreshId } = result.data;

		// 3) Check DB for refresh token validity
		const tokenRecord = await db
			.select()
			.from(refreshTokensTable)
			.where(
				and(
					eq(refreshTokensTable.id, oldRefreshId),
					eq(refreshTokensTable.revoked, false)
				)
			)
			.limit(1)
			.then((res) => res[0]);

		if (!tokenRecord || new Date(tokenRecord.expiresAt) < new Date()) {
			return c.json({ error: "Refresh token not recognized" }, 401);
		}

		// 4) Revoke the old refresh token
		await db
			.update(refreshTokensTable)
			.set({ revoked: true })
			.where(eq(refreshTokensTable.id, oldRefreshId));

		// 5) Create a new refresh token record
		const newRefreshId = uuid();
		const newExpires = new Date(Date.now() + REFRESH_TOKEN_EXP * 1000);
		await db.insert(refreshTokensTable).values({
			id: newRefreshId,
			sessionId: sessionId,
			expiresAt: newExpires,
			revoked: false,
		});

		// 6) Issue new tokens
		const newAccessToken = await sign(
			{ sub: addr, exp: Date.now() + ACCESS_TOKEN_EXP },
			process.env.JWT_SECRET!
		);
		const newRefreshToken = await sign(
			{
				sub: addr,
				sid: sessionId,
				jti: newRefreshId,
				exp: Date.now() + REFRESH_TOKEN_EXP,
			},
			process.env.JWT_SECRET!
		);

		// 7) Overwrite cookies (rotate tokens):contentReference[oaicite:19]{index=19}
		setCookie(c, "access_token", newAccessToken, {
			...COOKIE_OPTIONS,
			maxAge: ACCESS_TOKEN_EXP,
		});
		setCookie(c, "refresh_token", newRefreshToken, {
			...COOKIE_OPTIONS,
			maxAge: REFRESH_TOKEN_EXP,
		});

		return c.json({ message: "Tokens refreshed" }, 201);
	})
	.post("/logout", async (c) => {
		const refreshToken = getCookie(c, "refresh_token");
		// const refreshToken = getCookie(c, "refresh_token", "host");
		if (refreshToken) {
			try {
				const payload = await verify(
					refreshToken,
					process.env.JWT_SECRET!
				);
				const result = JwtPayloadSchema.safeParse(payload);

				if (!result.success) {
					return c.json({ error: result.error }, 400);
				}

				// Mark refresh token revoked
				await db
					.update(refreshTokensTable)
					.set({ revoked: true })
					.where(eq(refreshTokensTable.id, result.data.jti));
			} catch {
				// ignore if token invalid
			}
		}
		// Clear cookies (HttpOnly cookies set earlier)
		deleteCookie(c, "access_token", { path: "/" });
		deleteCookie(c, "refresh_token", { path: "/" });
		// deleteCookie(c, "access_token", { prefix: "host", path: "/" });
		// deleteCookie(c, "refresh_token", { prefix: "host", path: "/" });

		return c.json({ message: "Logged out" }, 201);
	});
