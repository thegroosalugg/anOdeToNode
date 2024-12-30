import express from "express";
import { getPosts } from "../controllers/feedController";

const router = express.Router();

router.get('/posts', getPosts);

export default router;
