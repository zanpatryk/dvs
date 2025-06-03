import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { db } from "../src/db";
import { sessionsTable } from "../src/db/schema/sessions";
import { eq } from "drizzle-orm";

const testAddress = "0x1234567890abcdef1234567890abcdef12345678";

beforeAll(async () => {
  await db.delete(sessionsTable).where(eq(sessionsTable.address, testAddress));
});

afterAll(async () => {
  await db.delete(sessionsTable).where(eq(sessionsTable.address, testAddress));
});

describe("sessionsTable insert and select", () => {
  it("should insert and retrieve a session", async () => {
    const inserted = await db
      .insert(sessionsTable)
      .values({
        address: testAddress,
      })
      .returning();

    expect(inserted.length).toBe(1);
    expect(inserted?.[0]?.address ?? "").toBe(testAddress);
    expect(inserted?.[0]?.id).toBeDefined();

if (inserted.length === 0 || !inserted[0]?.id) {
  throw new Error("No inserted records or missing id");
}

const results = await db
  .select()
  .from(sessionsTable)
  .where(eq(sessionsTable.id, inserted[0].id));

    expect(results.length).toBe(1);
    expect(results[0]?.address).toBe(testAddress);
  });
});
