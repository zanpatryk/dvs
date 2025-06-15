import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ticketStatus = pgEnum("status", ["pending", "resolved"]);

export const ticketsTable = pgTable("tickets", {
	id: uuid("id").primaryKey().defaultRandom(),
	issuerAddress: varchar("issuer_address", { length: 42 }).notNull(),
	status: ticketStatus("status")
		.default(ticketStatus.enumValues[0])
		.notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	response: text("response"),
});

export const insertTicketSchema = createInsertSchema(ticketsTable, {
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters" })
		.max(50, { message: "Title must be at most 50 characters" }),
	description: z
		.string()
		.min(3, { message: "Description must be at least 3 characters" })
		.max(250, {
			message: "Description must be at most 250 characters",
		}),
});

export const ticketFormSchema = insertTicketSchema.pick({
	title: true,
	description: true,
});

export const ticketResponseSchema = z.object({
	response: z
		.string()
		.min(3, { message: "Response must be at least 10 characters" })
		.max(1000, {
			message: "Response must be at most 1000 characters",
		}),
});

export type Ticket = typeof ticketsTable.$inferSelect;
