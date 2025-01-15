import express from "express";
import { postReply } from "../controllers/replyController";
import { validateField } from "../validation/validators";

const router = express.Router();

// all routes prepended by /post & JWT middleware
router.post('/reply/:postId', validateField('content', 10), postReply);

export default router;
