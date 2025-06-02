import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { db } from "../src/db";
import * as nonces from "../src/db/schema/nonces";
import * as polls from "../src/db/schema/polls";
import * as tickets from "../src/db/schema/tickets";

describe("Database connection", () => {
  it("should have a db object defined", () => {
    expect(db).toBeDefined();
  });

  it("should contain tables keys", () => {
    const schema = { ...nonces, ...polls, ...tickets };
    expect(schema).toHaveProperty("noncesTable");
    expect(schema).toHaveProperty("pollsTable");
    expect(schema).toHaveProperty("ticketsTable");
  });
});
