import { integer, pgTable } from "drizzle-orm/pg-core";

export const seedTable = pgTable("code_seed", {
	seed: integer("seed").primaryKey().notNull(),
});
