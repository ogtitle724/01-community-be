import express from "express";
import {
  signIn,
  logOut,
  generateCode,
  verifyCode,
  renewToken,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/logout", logOut);
router.get("/renew-token", renewToken);
router.get("/email-authcode", generateCode);

router.post("/login", signIn);
router.post("/email-authcode", verifyCode);

export default router;
