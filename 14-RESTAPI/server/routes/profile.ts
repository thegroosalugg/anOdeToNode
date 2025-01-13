import express from "express";
import { profilePic } from "../controllers/profileController";
import { getPosts } from "../controllers/feedController";
// import { validatePost } from "../validation/validators";

const router = express.Router();

// all routes prepended by /profile & JWT middleware
router.get('/posts', getPosts);
router.post('/pic', profilePic);

export default router;
