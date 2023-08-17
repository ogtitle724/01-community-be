import express from "express";
import {
  readPosts,
  getFilteredPosts,
  readPost,
  createPost,
  updatePost,
  deletePost,
  setPostRec,
  handleView,
  addComment,
  setCommendRec,
  deleteComment,
  updateComment,
} from "../controllers/boardController.js";

const router = express.Router();

//post
router.post("/post", createPost);
router.patch("/post/:postId", updatePost);
router.get("/post/:postId", readPost);
router.delete("/post/:postId", deletePost);
router.patch("/post/:postId/recommend", setPostRec);

//comment
router.post("/post/:postId/comment", addComment);
router.post("/post/:postId/comment/:commentId/reply", addComment);
router.patch("/post/:postId/comment/:commentId", updateComment);
router.delete("/post/:postId/comment/:commentId", deleteComment);
router.patch("/post/:postId/comment/:commentId/recommend", setCommendRec);

//pagination
router.get("/posts/search", getFilteredPosts);
router.get("/posts/best");
router.get("/posts/:category", readPosts);

export default router;
