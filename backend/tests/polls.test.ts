import { describe, it, expect, beforeAll } from "bun:test";
import { db } from "../src/db";
import {
  pollsTable,
  pollsParticipantsTable,
  pollsOptionsTable,
} from "../src/db/schema/polls";
import { eq } from "drizzle-orm";

const pollId = "12345678901234567890";

beforeAll(async () => {
  // Clean up in case test data already exists
  await db.delete(pollsParticipantsTable).where(eq(pollsParticipantsTable.pollId, pollId));
  await db.delete(pollsOptionsTable).where(eq(pollsOptionsTable.pollId, pollId));
  await db.delete(pollsTable).where(eq(pollsTable.id, pollId));
});

describe("pollsTable insert and select", () => {
  it("should insert and retrieve a poll", async () => {
    await db.insert(pollsTable).values({
      id: pollId,
      creatorAddress: "0x1234567890123456789012345678901234567890",
      title: "Test Poll",
      description: "Test description",
      participantLimit: 100,
      accessCode: "ABC123",
      startTime: new Date(),
    });

    const results = await db.select().from(pollsTable).where(eq(pollsTable.id, pollId));
    expect(results.length).toBe(1);
    expect(results?.[0]?.accessCode ?? "").toBe("ABC123");
  });
});

describe("pollsParticipantsTable composite key", () => {
  it("should insert and find participant", async () => {
    await db.insert(pollsParticipantsTable).values({
      pollId,
      participantAddress: "0x1111111111111111111111111111111111111111",
    });

    const results = await db
      .select()
      .from(pollsParticipantsTable)
      .where(eq(pollsParticipantsTable.pollId, pollId));

    expect(results.length).toBe(1);
  });
});

describe("pollsOptionsTable composite key", () => {
  it("should insert and find option", async () => {
    await db.insert(pollsOptionsTable).values({
      pollId,
      option: "Option A",
    });

    const results = await db
      .select()
      .from(pollsOptionsTable)
      .where(eq(pollsOptionsTable.pollId, pollId));

    expect(results.length).toBe(1);
    expect(results?.[0]?.option ?? "").toBe("Option A");
  });
});