import express from "express";
import { newPost, editPost, deletePost } from "../controllers/postController";
import { validatePost } from "../validation/validators";

const router = express.Router();

// all routes prepended by /post & JWT middleware
router.post('/new',         validatePost,  newPost);
router.put('/edit/:postId', validatePost, editPost);
router.delete('/delete/:postId',          deletePost);

export default router;
