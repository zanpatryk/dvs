import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const sessionsTable = pgTable("sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	address: varchar("address", { length: 42 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});
