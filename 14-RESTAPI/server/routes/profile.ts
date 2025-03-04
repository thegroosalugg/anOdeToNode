import express from "express";
import { setPhoto, updateInfo } from "../controllers/profileController";
import { getPosts } from "../controllers/feedController";

const router = express.Router();

// all routes prepended by /profile & JWT middleware
router.get('/posts',    getPosts); // re-used from feed. New URL sets new conditions
router.post('/set-pic', setPhoto);
router.post('/info',  updateInfo);

export default router;
