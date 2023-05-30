import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import boardRouter from "./routes/boardRouter.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cors());

// Routes setup
app.use("/api/board", boardRouter);
app.use("/api/auth", authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
