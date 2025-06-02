import { describe, it, expect } from "bun:test";
import { cn, formatDate, formatAddress } from "../src/lib/utils";


describe("utils", () => {
  describe("cn (className merge)", () => {
    it("merges and dedupes Tailwind classes", () => {
      const result = cn("bg-red-500", "text-center", "bg-blue-500", "font-bold");
      const expectedClasses = ["text-center", "font-bold", "bg-blue-500"];
      
      const resultClasses = result.split(" ");
      expectedClasses.forEach(cls => {
        expect(resultClasses).toContain(cls);
      });
      
      expect(new Set(resultClasses).size).toBe(resultClasses.length);
    });

    it("handles conditional classes", () => {
      const result = cn("text-lg", false && "hidden", undefined, "font-semibold");
      expect(result.split(" ")).toEqual(expect.arrayContaining(["text-lg", "font-semibold"]));
    });
  });

  describe("formatDate", () => {
    it("formats a Date in Polish locale with Warsaw timezone", () => {
      const date = new Date(Date.UTC(2023, 4, 1, 12, 30)); // May 1, 2023 12:30 UTC
      const formatted = formatDate(date);

      expect(formatted).toMatch(/\b1\.05\.2023\b.*14:30/);
    });
  });

  describe("formatAddress", () => {
    it("shortens an address with ellipsis", () => {
      const address = "0x1234567890abcdef1234567890abcdef12345678";
      const formatted = formatAddress(address);
      expect(formatted).toBe("0x1234...5678");
    });

    it("handles short strings gracefully", () => {
      const address = "abcdef";
      const formatted = formatAddress(address);
      expect(formatted).toBe("abcdef...cdef");
    });
  });
});
