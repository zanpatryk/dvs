import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import {
	ticketFormSchema,
	ticketResponseSchema,
	ticketsTable,
} from "../db/schema/tickets";
import type { Variables } from "./auth";

export const ticketsRoute = new Hono<{ Variables: Variables }>()
	.get("/", async (c) => {
		const tickets = await db.select().from(ticketsTable);

		if (tickets.length === 0) {
			return c.json({ error: "No tickets found" }, 404);
		}

		return c.json(tickets);
	})
	.get("/my", async (c) => {
		const payload = c.get("jwtPayload");

		const address = payload.sub;

		const tickets = await db
			.select()
			.from(ticketsTable)
			.where(eq(ticketsTable.issuerAddress, address));

		if (tickets.length === 0) {
			return c.json({ error: "No tickets found" }, 404);
		}

		return c.json(tickets);
	})
	.post("/", zValidator("json", ticketFormSchema), async (c) => {
		const payload = c.get("jwtPayload");

		const issuerAddress = payload.sub;

		const formTicket = c.req.valid("json");

		const ticket = {
			...formTicket,
			issuerAddress,
		};

		const result = await db
			.insert(ticketsTable)
			.values(ticket)
			.returning()
			.then((res) => res[0]);

		if (!result) {
			return c.json({ error: "Could not create ticket" }, 500);
		}

		return c.json(result, 201);
	})
	.get("/:id", async (c) => {
		const id = c.req.param("id");

		const ticket = await db
			.select()
			.from(ticketsTable)
			.where(eq(ticketsTable.id, id))
			.limit(1)
			.then((res) => res[0]);

		if (!ticket) {
			return c.json({ error: "Ticket not found" }, 404);
		}

		return c.json(ticket);
	})
	.patch("/:id", zValidator("json", ticketResponseSchema), async (c) => {
		const id = c.req.param("id");

		const { response } = c.req.valid("json");

		const ticket = await db
			.update(ticketsTable)
			.set({ response, status: "resolved" })
			.where(eq(ticketsTable.id, id))
			.returning()
			.then((res) => res[0]);

		if (!ticket) {
			return c.json({ error: "Could not resolve ticket" }, 500);
		}

		return c.json(ticket);
	});
