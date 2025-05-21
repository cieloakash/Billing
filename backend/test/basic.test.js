import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js"; 

describe("GET /", () => {
  it("should return { ok: true }", async () => {
    const res = await request(app).get("/");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ ok: true });
  });
});
