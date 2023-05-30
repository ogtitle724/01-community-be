import express from "express";
import { signUp, signIn } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/authenticate", signIn);

export default router;
