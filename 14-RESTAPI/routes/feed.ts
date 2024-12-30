import express from "express";
import { getPosts, newPost } from "../controllers/feedController";

const router = express.Router();

// all routes prepended by /feed
router.get('/posts', getPosts);
router.post('/new-post', newPost);

export default router;
