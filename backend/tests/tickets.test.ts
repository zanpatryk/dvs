import { describe, it, expect } from "bun:test";
import { insertTicketSchema } from "../src/db/schema/tickets";

describe("insertTicketSchema validation", () => {
  it("should fail when title is too short", () => {
    const data = {
      issuerAddress: "0x1234567890123456789012345678901234567890",
      title: "Hi",
      description: "This description is long enough",
    };
    const result = insertTicketSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
    const firstErrorMsg = result.error?.errors?.[0]?.message ?? "";
    expect(firstErrorMsg).toMatch(/at least 3 characters/);
    }
  });

  it("should pass with valid data", () => {
    const data = {
      issuerAddress: "0x1234567890123456789012345678901234567890",
      title: "Valid title",
      description: "This description is definitely long enough",
    };
    const result = insertTicketSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
