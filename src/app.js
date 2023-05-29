import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import boardRouter from "./routes/board.js";

dotenv.config();
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cors());

// Routes setup
app.use("/api/board", boardRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
