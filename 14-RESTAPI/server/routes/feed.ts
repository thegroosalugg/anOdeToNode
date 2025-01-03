import express from "express";
import { getPosts, getPostById, newPost } from "../controllers/feedController";
import { validatePost } from "../validation/validators";

const router = express.Router();

// all routes prepended by /feed
router.get('/posts', getPosts);
router.get('/post/:postId', getPostById);
router.post('/new-post', validatePost, newPost);

export default router;
