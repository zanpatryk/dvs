import { Hono } from "hono";
import { db } from "../db";
import { and, eq, getTableColumns } from "drizzle-orm";
import { pollsInsertSchema, pollsOptionsTable, pollsParticipantsTable, pollsTable } from "../db/schema/polls";
import type { Variables } from "./auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const PollInsertSchema = z.object({
	title: z.string().min(1),
	description: z.string(),
	options: z
		.array(z.object({ value: z.string().min(1) }))
		.min(1)
		.max(10),
	endTime: z
		.string()
		.refine((val) => !isNaN(Date.parse(val))),
	managerIncluded: z.boolean(),
});

export const pollsRoute = new Hono<{ Variables: Variables }>()
	.post("/", zValidator("json", PollInsertSchema), async (c) => {
		const payload = c.get("jwtPayload")

		const address = payload.sub

		const poll = c.req.valid("json")

		const pollid = Date.now().toString()

		const polldb = pollsInsertSchema.parse({
			id: pollid,
			creatorAddress: address,
			title: poll.title,
			description: poll.description,
			startTime: new Date(),
			endTime: new Date(poll.endTime)
		})
		
		const responseCreate = await db
			.insert(pollsTable)
			.values(polldb)
			.returning()
			.then((res) => res[0]);

		try {
			poll.options.map(async (option) => {
				const responseOption = await db
					.insert(pollsOptionsTable)
					.values({ pollId: pollid, option: option.value })
					.returning()
					.then((res) => res[0])

				if (!responseOption)
					throw new Error("Could not insert option")
			})
		} catch {
			return c.text("Could not insert option into db")
		}
		
		c.status(201);
		return c.json(responseCreate);
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
			.select({ ...getTableColumns(pollsTable) })
			.from(pollsTable)
			.where(eq(pollsTable.creatorAddress, address));

		if (polls.length === 0) return c.json({ error: "No polls found" }, 404);

		return c.json(polls);
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
	})
