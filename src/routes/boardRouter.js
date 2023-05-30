import express from "express";
import { sendPosts } from "../controllers/boardController.js";

const router = express.Router();

router.get("/post", sendPosts);
/* router.get("/api/board/search", sendPost);
router.get("/api/board/recommendBoard", boardController);
router.get("/api/board/register", boardController);
router.get("/api/board/{boardId}/comment/delete/{commentId}}", boardController);
router.get("/api/board/{boardId}/comment", boardController);
 */
export default router;
