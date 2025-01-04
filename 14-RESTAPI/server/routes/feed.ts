import express from "express";
import { getPosts, getPostById, newPost, deletePost } from "../controllers/feedController";
import { validatePost } from "../validation/validators";

const router = express.Router();

// all routes prepended by /feed
router.get('/posts', getPosts);
router.get('/post/:postId', getPostById);
router.post('/new-post', validatePost, newPost);
router.delete('/post/:postId', deletePost);

export default router;
