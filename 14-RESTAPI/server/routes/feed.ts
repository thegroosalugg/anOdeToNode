import express from "express";
import { getPosts, getPostById, newPost, editPost, deletePost } from "../controllers/feedController";
import { validatePost } from "../validation/validators";

const router = express.Router();

// all routes prepended by /feed
router.get('/posts', getPosts);
router.get('/post/:postId', getPostById);
router.post('/new-post', validatePost, newPost);
router.put('/post/:postId', validatePost, editPost);
router.delete('/post/:postId', deletePost);

export default router;
