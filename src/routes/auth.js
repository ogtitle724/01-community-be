import express from "express";
import authenticate from "../controllers/userController";

const router = express.Router();

router.post("/api/auth/register", register);
router.post("/api/auth/authenticate", auth);
router.post("/api/auth/logout", logout);
