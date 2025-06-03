import { beforeAll, afterAll, describe, it, expect } from "bun:test";
import { Window } from "happy-dom";

let window: Window;

beforeAll(() => {
  window = new Window();
  (globalThis as any).window = window;
  (globalThis as any).document = window.document;
});

afterAll(() => {
  (globalThis as any).window = undefined;
  (globalThis as any).document = undefined;
});

describe("useMetaMask hook", () => {
  it("login calls ethereum and client methods", async () => {
    (window as any).ethereum = {
      request: () => Promise.resolve(["0x123"]),
    };
    // Your test here...
    expect(window.ethereum).toBeDefined();
  });
});
