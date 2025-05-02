import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const statusEnum = pgEnum("status", ["pending", "resolved"]);

export const ticketsTable = pgTable("tickets", {
	id: uuid("id").primaryKey().defaultRandom(),
	issuerAddress: varchar("issuer_address", { length: 42 }).notNull(),
	status: statusEnum("status").default(statusEnum.enumValues[0]),
	createdAt: timestamp("created_at").defaultNow(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	response: text("response"),
});

export const insertTicketSchema = createInsertSchema(ticketsTable, {
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters" })
		.max(100, { message: "Title must be at most 100 characters" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 3 characters" })
		.max(1000, {
			message: "Description must be at most 1000 characters",
		}),
});

export const selectTicketSchema = createSelectSchema(ticketsTable);
