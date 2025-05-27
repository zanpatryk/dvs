import { Hono } from "hono";
import { PollsData } from "../../../dvs-app/src/dummy/data";
import { db } from "../db";
import { and, eq, getTableColumns } from "drizzle-orm";
import { pollsParticipantsTable, pollsTable } from "../db/schema/polls";
import type { Variables } from "./auth";

export const pollsRoute = new Hono<{ Variables: Variables }>()
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
