import express from "express";
import {
  sendPosts,
  sendFilteredPost,
  uploadPost,
  updatePost,
  removePost,
} from "../controllers/boardController.js";

const router = express.Router();

router.get("/post", sendPosts);
router.get("/search", sendFilteredPost);
router.post("/register", uploadPost);
router.post("/update", updatePost);
router.post("/delete", removePost);
/*router.get("/api/board/recommendBoard", boardController);

router.get("/api/board/{boardId}/comment/delete/{commentId}}", boardController);
router.get("/api/board/{boardId}/comment", boardController);
 */
export default router;
