import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { autoLogIn, verifyToken } from "./middleware/initialProcess.js";
import boardRouter from "./routes/boardRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser(process.env.COOKIE_SECRET, { secure: true }));
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies(use bulit-in querystring library)
app.use(
  //cors setting for cookie
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(autoLogIn);
app.use(verifyToken);

// Routes setup
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
