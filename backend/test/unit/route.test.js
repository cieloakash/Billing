import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Auth Routes", () => {
  let testUser;
  const testPassword = "123456";
  let authToken;

  before(async () => {
    await mongoose.connect(process.env.MONGOOSE_URL);
    
    // Create test user with hashed password
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    testUser = await User.create({
      username: `testuser_${Date.now()}`,
      password: hashedPassword,
      role: "sales"
    });
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /auth/register", () => {
    it("should register a user with valid credentials", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: `newuser_${Date.now()}`,
          password: testPassword,
          role: "sales"
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "User created successfully");
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ username: "incompleteuser" });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error");
    });

    it("should return 400 for password less than 6 characters", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: `shortpassuser_${Date.now()}`,
          password: "123",
          role: "sales"
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "password length must be greater than 6");
    });

    it("should return 400 for duplicate username", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({
          username: testUser.username,
          password: testPassword,
          role: "sales"
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Username already exists");
    });
  });

  describe("POST /auth/login", () => {
    it("should login user with valid credentials", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          username: testUser.username,
          password: testPassword
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("username", testUser.username);
      expect(res.headers['set-cookie']).to.exist;
      authToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    });

    it("should return 401 for invalid password", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          username: testUser.username,
          password: "wrongpassword"
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.eql({
        success: false,
        message: "Invalid credentials"
      });
    });

    it("should return 400 for missing username", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ password: testPassword });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message","Username and password are required");
    });

    it("should return 400 for missing password", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: testUser.username });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Username and password are required");
    });

    it("should return 401 for non-existent user", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          username: "nonexistentuser",
          password: testPassword
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.eql({
        success: false,
        message: "Invalid credentials"
      });
    });
  });

  describe("GET /auth/check", () => {
    it("should return user data with valid token", async () => {
      const res = await request(app)
        .get("/auth/check")
        .set('Cookie', [`jwtoken=${authToken}`]);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.user).to.have.property("id", testUser._id.toString());
      expect(res.body.user).to.have.property("role", "sales");
    });

    it("should return 401 without token", async () => {
      const res = await request(app)
        .get("/auth/check");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Unauthorized - No Token Provided");
    });

    it("should return 401 with invalid token", async () => {
      const res = await request(app)
        .get("/auth/check")
        .set('Cookie', ['jwtoken=invalidtoken']);
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Unauthorized - Invalid Token");
    });

    it("should return 401 with expired token", async () => {
      const expiredToken = jwt.sign(
        { id: testUser._id, role: "sales" },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      );
      
      const res = await request(app)
        .get("/auth/check")
        .set('Cookie', [`jwtoken=${expiredToken}`]);

        

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("success", false);
    });

    it("should return 403 for unauthorized role", async () => {
      // Create user with unauthorized role
      const unauthorizedUser = await User.create({
        username: `unauthorized_${Date.now()}`,
        password: testPassword,
        role: "guest"
      });
      
      // Login to get token
      const loginRes = await request(app)
        .post("/auth/login")
        .send({
          username: unauthorizedUser.username,
          password: testPassword
        });
      const token = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1];

      const res = await request(app)
        .get("/auth/check")
        .set('Cookie', [`jwtoken=${token}`]);
        console.log(res);

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("message").that.includes("Access forbidden");
    });
  });

  describe("POST /auth/logout", () => {
    it("should clear the jwtoken cookie", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set('Cookie', [`jwtoken=${authToken}`]);

      expect(res.status).to.equal(200);
      expect(res.headers['set-cookie'][0]).to.include("jwtoken=;");
      expect(res.body).to.have.property("message", "logout sucessfully");
    });

    it("should succeed even without token", async () => {
      const res = await request(app)
        .post("/auth/logout");

      expect(res.status).to.equal(200);
    });
  });
});