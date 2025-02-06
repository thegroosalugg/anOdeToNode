import express from "express";
import { getPosts, getPostById } from "../controllers/feedController";

const router = express.Router();

// all routes prepended by /feed
router.get('/posts',           getPosts);
router.get('/find/:postId', getPostById);

export default router;
