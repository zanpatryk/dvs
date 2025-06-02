import { describe, it, expect } from "bun:test";
import app from "../src/index";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "test_secret";
const validToken = jwt.sign({ sub: "test-user" }, JWT_SECRET, { expiresIn: "1h" });

const fetchWithToken = (url: string, method = "GET") =>
  app.fetch(
    new Request(url, {
      method,
      headers: { cookie: `access_token=${validToken}` },
    })
  );

describe("App integration tests", () => {
//   it("GET /api/health returns status ok", async () => {
//     const res = await app.fetch(new Request("http://localhost/api/health"));
//     expect(res.status).toBe(200);
//     const json = await res.json();
//     expect(json.status).toBe("ok");
//   });  CLOSED TO UNA

  it("GET /api/me rejects without token", async () => {
    const res = await app.fetch(new Request("http://localhost/api/me"));
    expect(res.status).toBe(401);
  });

  it("GET /api/me allows with valid token", async () => {
    const res = await fetchWithToken("http://localhost/api/me");
    expect(res.status).toBe(200);
  });

//   it("GET / serves static index.html", async () => {
//     const res = await app.fetch(new Request("http://localhost/"));
//     expect(res.status).toBe(200);
//     const text = await res.text();
//     expect(text).toContain("<!DOCTYPE html>");
//   });
});
