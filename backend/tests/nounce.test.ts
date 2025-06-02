import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { db } from "../src/db";
import { noncesTable } from "../src/db/schema/nonces";
import { eq, gt, lt } from "drizzle-orm";

const address = "0x1234567890123456789012345678901234567890";

describe("nonces table tests", () => {
  beforeAll(async () => {
    await db.delete(noncesTable).where(eq(noncesTable.address, address));
  });

  it("should insert a nonce", async () => {
    await db.delete(noncesTable).where(eq(noncesTable.address, address));

    const nonce = "testnonce123";
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    const result = await db.insert(noncesTable)
      .values({
        address,
        nonce,
        expiresAt,
      })
      .returning();


    expect(result[0]?.address).toBe(address);
    expect(result[0]?.nonce).toBe(nonce);
  });

  it("should fetch unexpired nonces", async () => {
    const now = new Date();

    const nonces = await db
      .select()
      .from(noncesTable)
      .where(gt(noncesTable.expiresAt, now));

    for (const nonce of nonces) {
      expect(nonce.expiresAt.getTime()).toBeGreaterThan(now.getTime());
    }
  });

  it("should update a nonce for a given address", async () => {
    const newNonce = "updatednonce456";

    await db
      .update(noncesTable)
      .set({ nonce: newNonce })
      .where(eq(noncesTable.address, address));

    const updated = await db
      .select()
      .from(noncesTable)
      .where(eq(noncesTable.address, address))
      .limit(1);

    expect(updated[0]?.nonce).toBe(newNonce);
  });

  it("should delete expired nonces", async () => {
    const pastDate = new Date(Date.now() - 1000 * 60);

    await db.delete(noncesTable).where(lt(noncesTable.expiresAt, pastDate));

    const expired = await db
      .select()
      .from(noncesTable)
      .where(lt(noncesTable.expiresAt, pastDate));

    expect(expired.length).toBe(0);
  });
});
