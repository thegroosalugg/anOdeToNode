import express from "express";
import { newPost, editPost, deletePost } from "../controllers/adminController";
import { validatePost } from "../validation/validators";

const router = express.Router();

// all routes prepended by /admin & JWT middleware
router.post('/new-post',    validatePost,  newPost);
router.put('/post/:postId', validatePost, editPost);
router.delete('/post/:postId',          deletePost);

export default router;
