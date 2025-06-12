import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	numeric,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const pollsTable = pgTable(
	"polls",
	{
		id: numeric("id", { precision: 78, scale: 0 }).primaryKey(), // uint256
		creatorAddress: varchar("creator_address", { length: 42 }).notNull(),
		title: text("title").notNull(),
		description: text("desctiption").notNull(),
		participantLimit: integer("participant_limit").notNull(),
		accessCode: varchar("access_code", { length: 66 }).notNull(),
		startTime: timestamp("start_time").notNull(),
		endTime: timestamp("end_time").notNull(),
		hasEndedPrematurely: boolean("has_ended_prematurely").default(false),
	},
	(t) => [index("creator_idx").on(t.creatorAddress)]
);

export const pollsRelations = relations(pollsTable, ({ many }) => ({
	participantAdresses: many(pollsParticipantsTable),
	pollOptions: many(pollsOptionsTable),
}));

export const pollsParticipantsTable = pgTable(
	"polls_participants",
	{
		pollId: numeric("poll_id", { precision: 78, scale: 0 })
			.notNull()
			.references(() => pollsTable.id),
		participantAddress: varchar("participant_address", {
			length: 42,
		}).notNull(),
	},
	(t) => [
		primaryKey({
			columns: [t.pollId, t.participantAddress],
		}),
		index("participant_idx").on(t.participantAddress),
	]
);

export const pollsParticipantsRelations = relations(
	pollsParticipantsTable,
	({ one }) => ({
		poll: one(pollsTable, {
			fields: [pollsParticipantsTable.pollId],
			references: [pollsTable.id],
		}),
	})
);

export const pollsOptionsTable = pgTable(
	"polls_options",
	{
		pollId: numeric("poll_id", { precision: 78, scale: 0 })
			.notNull()
			.references(() => pollsTable.id),
		option: text("option").notNull(),
	},
	(t) => [
		primaryKey({
			columns: [t.pollId, t.option],
		}),
		index("poll_idx").on(t.pollId),
	]
);

export const pollsOptionsRelations = relations(
	pollsOptionsTable,
	({ one }) => ({
		poll: one(pollsTable, {
			fields: [pollsOptionsTable.pollId],
			references: [pollsTable.id],
		}),
	})
);

export const pollsInsertSchema = createInsertSchema(pollsTable);

export const pollsParticipantsInsertSchema = createInsertSchema(
	pollsParticipantsTable
);

export const pollsOptionsInsertSchema = createInsertSchema(pollsOptionsTable);

export type Poll = typeof pollsTable.$inferSelect;
