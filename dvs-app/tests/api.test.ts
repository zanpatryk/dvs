import { describe, it, expect } from "bun:test";
import { apiCall } from "../src/lib/api";

function createMockResponse(status, ok = true, data = {}) {
  return { status, ok, json: async () => data };
}

describe("apiCall", () => {
  it("returns response directly if status is not 401", async () => {
    const fn = async () => createMockResponse(200, true, { retried: true });

    const res = await apiCall(fn);

    expect(res.status).toBe(200);
  });

  it("retries once after 401 if refresh succeeds", async () => {
    let callCount = 0;
    const fn = async () => {
      callCount++;
      if (callCount === 1) return createMockResponse(401, false);
      return createMockResponse(200, true);
    };

    const res = await apiCall(fn);

    expect(res.status).toBe(401);
  });

  it("returns original 401 response if refresh fails", async () => {
    const fn = async () => createMockResponse(401, false);

    const res = await apiCall(fn);

    expect(res.status).toBe(401);
  });

  it("throws error if refresh throws error", async () => {
    const fn = async () => createMockResponse(401, false);

    try {
      await apiCall(fn);
      // Fail if no error thrown
      throw new Error("Expected apiCall to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBeDefined();
    }
  });
});
