import { Hono } from "hono";
import { db } from "../db";
import { and, eq, getTableColumns } from "drizzle-orm";
import {
	pollsInsertSchema,
	pollsOptionsTable,
	pollsParticipantsTable,
	pollsTable,
} from "../db/schema/polls";
import type { Variables } from "./auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { seedTable } from "../db/schema/code-seed";

const PollInsertSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	options: z
		.array(z.object({ value: z.string().min(1) }))
		.min(1)
		.max(10),
	endTime: z.string().refine((val) => !isNaN(Date.parse(val))),
	managerIncluded: z.boolean(),
	participantLimit: z.number().min(1),
});

export const pollsRoute = new Hono<{ Variables: Variables }>()
	.post("/", zValidator("json", PollInsertSchema), async (c) => {
		const payload = c.get("jwtPayload");

		const address = payload.sub;

		const poll = c.req.valid("json");

		const pollid = Date.now().toString();

		const pollCode = await db.transaction(async (tx) => {
			const [row] = await tx.select().from(seedTable).limit(1);
			if (!row) throw new Error("Seed row not found");

			const currentSeed = row.seed;

			await tx.update(seedTable).set({ seed: currentSeed + 1 });

			return currentSeed;
		});

		const polldb = pollsInsertSchema.parse({
			id: pollid,
			creatorAddress: address,
			title: poll.title,
			description: poll.description,
			participantLimit: poll.participantLimit,
			accessCode: pollCode.toString().padStart(6, "0"),
			startTime: new Date(),
			endTime: new Date(poll.endTime),
		});

		const createdPoll = await db
			.insert(pollsTable)
			.values(polldb)
			.returning()
			.then((res) => res[0]);

		if (!createdPoll) {
			return c.json({ error: "Could not create poll" }, 500);
		}

		poll.options.map(async (option) => {
			const responseOption = await db
				.insert(pollsOptionsTable)
				.values({ pollId: pollid, option: option.value })
				.returning()
				.then((res) => res[0]);

			if (!responseOption)
				return c.json(
					{ error: `Could not add option: ${option.value}` },
					500
				);
		});

		if (poll.managerIncluded) {
			const participant = await db
				.insert(pollsParticipantsTable)
				.values({
					pollId: pollid,
					participantAddress: address,
				})
				.returning()
				.then((res) => res[0]);

			if (!participant)
				return c.json(
					{ error: "Could not add manager as participant" },
					500
				);
		}

		c.status(201);
		return c.json(createdPoll);
	})
	.get("/", async (c) => {
		const payload = c.get("jwtPayload");

		const address = payload.sub;

		const polls = await db
			.select({ ...getTableColumns(pollsTable) })
			.from(pollsTable)
			.innerJoin(
				pollsParticipantsTable,
				eq(pollsTable.id, pollsParticipantsTable.pollId)
			)
			.where(eq(pollsParticipantsTable.participantAddress, address));

		if (polls.length === 0) return c.json({ error: "No polls found" }, 404);

		return c.json(polls);
	})
	.get("/created", async (c) => {
		const payload = c.get("jwtPayload");

		const address = payload.sub;

		const polls = await db
			.select()
			.from(pollsTable)
			.where(eq(pollsTable.creatorAddress, address));

		if (!polls) return c.json({ error: "No polls found" }, 404);

		return c.json(polls);
	})
	.patch("/:id/end", async (c) => {
		const payload = c.get("jwtPayload");

		const address = payload.sub;

		const pollId = c.req.param("id");

		const result = await db
			.update(pollsTable)
			.set({ hasEndedPrematurely: true })
			.where(
				and(
					eq(pollsTable.id, pollId),
					eq(pollsTable.creatorAddress, address)
				)
			)
			.returning()
			.then((res) => res[0]);

		if (!result) {
			return c.json({ error: "Poll not found" }, 404);
		}
		return c.json({ message: "Poll ended successfully" }, 200);
	})
	.get("/:id", async (c) => {
		const payload = c.get("jwtPayload");
		const pollId = c.req.param("id");

		const address = payload.sub;

		const poll = await db
			.select({ ...getTableColumns(pollsTable) })
			.from(pollsTable)
			.innerJoin(
				pollsParticipantsTable,
				eq(pollsTable.id, pollsParticipantsTable.pollId)
			)
			.where(
				and(
					eq(pollsTable.id, pollId),
					eq(pollsParticipantsTable.participantAddress, address)
				)
			)
			.limit(1)
			.then((res) => res[0]);

		if (!poll) {
			return c.json({ error: "No poll found" }, 404);
		}

		return c.json({ poll });
	});
