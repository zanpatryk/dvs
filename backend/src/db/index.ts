import { drizzle } from "drizzle-orm/postgres-js";
import * as nonces from "./schema/nonces";
import * as polls from "./schema/polls";
import * as refreshTokens from "./schema/refresh-tokens";
import * as sessions from "./schema/sessions";
import * as tickets from "./schema/tickets";

export const db = drizzle({
	connection: process.env.DATABASE_URL!,
	schema: { ...nonces, ...polls, ...refreshTokens, ...sessions, ...tickets },
});
