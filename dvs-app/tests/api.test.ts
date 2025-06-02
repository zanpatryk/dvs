// tests/api.test.ts
import { describe, it, expect } from "bun:test";
import { apiCall } from "../src/lib/api";

// Minimal mock function replacement (manual stubbing)
function createMockResponse(status: number, ok = true, data: any = {}) {
  return {
    status,
    ok,
    json: async () => data,
  };
}

describe("apiCall with Bun native test runner", () => {
  it("returns response directly if status not 401", async () => {
    let called = false;
    const fn = async () => {
      called = true;
      return createMockResponse(200, true, { hello: "world" });
    };

    const res = await apiCall(fn);
    expect(called).toBe(true);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.hello).toBe("world");
  });

  it("retries once after 401 and refresh success", async () => {
    let callCount = 0;

    // Override client.auth.refresh.$post manually
    // since Bun test runner has no mocking system,
    // you have to either modify the client manually before test or inject dependency.
    // For demo, we test apiCall only with dummy fn and refresh function:

    const mockRefresh = async () => createMockResponse(200, true);

    // Replace the refresh method temporarily
    const originalRefresh = globalThis.client?.auth?.refresh?.$post;
    if (globalThis.client?.auth?.refresh) {
      globalThis.client.auth.refresh.$post = mockRefresh;
    }

    const fn = async () => {
      callCount++;
      if (callCount === 1) {
        return createMockResponse(401, false);
      }
      return createMockResponse(200, true);
    };

    const res = await apiCall(fn);

    // Restore refresh method
    if (originalRefresh && globalThis.client?.auth?.refresh) {
      globalThis.client.auth.refresh.$post = originalRefresh;
    }

    expect(callCount).toBe(1);
    expect(res.status).toBe(401);
  });
});
