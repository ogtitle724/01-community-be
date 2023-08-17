import express from "express";
import {
  sendUserData,
  signUp,
  checkUid,
  checkNick,
} from "../controllers/userController.js";

const router = express.Router();

router.get("", sendUserData);
router.post("", signUp);
router.post("/check-uid", checkUid);
router.post("/check-nick", checkNick);

export default router;
