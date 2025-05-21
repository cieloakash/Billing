import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes.js";

import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser())

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send({ ok: true }));
app.use("/auth", authRoute);

export default app;
