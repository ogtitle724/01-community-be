import express from "express";
import {
  signUp,
  signIn,
  logOut,
  refresh,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/authenticate", signIn);
router.post("/logout", logOut);
router.post("/silentRefresh", refresh);

export default router;
