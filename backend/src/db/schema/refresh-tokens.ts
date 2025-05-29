import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { sessionsTable } from "./sessions";

export const refreshTokensTable = pgTable("refresh_tokens", {
	id: uuid("id").primaryKey().defaultRandom(), // JWT ID (jti)
	sessionId: uuid("session_id")
		.notNull()
		.references(() => sessionsTable.id),
	expiresAt: timestamp("expires_at").notNull(),
	revoked: boolean("revoked").notNull().default(false),
});
