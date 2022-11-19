import express from "express";
import {
  getPosts,
  getPost,
  getPostsBySearch,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/posts.js";

// in order to add auth middleware before each route to check if the user is logged in or not
import auth from "../middleware/auth.js";

const router = express.Router();
// localhost:5000/posts [we added a prefix of posts to all routes in here]
router.get("/", getPosts);
// adding more routes
router.get("/search", getPostsBySearch);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
// can only like once from a specific id
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);
export default router;
