import express from "express";
import {
  signUp,
  signIn,
  logOut,
  refresh,
  generateCode,
  verifyCode,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/authenticate", signIn);
router.post("/logout", logOut);
router.post("/silentRefresh", refresh);
router.post("/generateCode", generateCode);
router.post("/verifyCode", verifyCode);

export default router;
