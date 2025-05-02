import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const noncesTable = pgTable("nonces", {
	address: varchar("address", { length: 42 }).primaryKey(),
	nonce: text("nonce").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
});
