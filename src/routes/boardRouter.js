import express from "express";
import {
  sendPosts,
  sendFilteredPost,
  sendPostDetail,
  uploadPost,
  updatePost,
  removePost,
  handleRecommend,
  handleView,
  addComment,
} from "../controllers/boardController.js";

const router = express.Router();

router.get("/post", sendPosts);
router.get("/search", sendFilteredPost);
router.get("/:boardId", sendPostDetail);

router.post("/register", uploadPost);
router.post("/update", updatePost);
router.post("/delete", removePost);
router.post("/rec", handleRecommend);
router.post("/view", handleView);
router.post("/:boardId/comment", addComment);
/*router.get("/api/board/recommendBoard", boardController);

router.get("/api/board/{boardId}/comment/delete/{commentId}}", boardController);
router.get("/api/board/{boardId}/comment", boardController);
 */
export default router;
