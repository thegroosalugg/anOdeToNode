import express from "express";
import { newPost, editPost, deletePost } from "../controllers/adminController";
import { validatePost } from "../validation/validators";
import { authJWT } from "../middleware/auth.JWT";

const router = express.Router();

// all routes prepended by /admin
router.post('/new-post', authJWT, validatePost, newPost);
router.put('/post/:postId', authJWT, validatePost, editPost);
router.delete('/post/:postId', authJWT, deletePost);

export default router;
