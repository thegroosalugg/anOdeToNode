import Express from "express";
import { markAsRead } from "../controllers/notifController";

const router = Express.Router();

// all routes prepended by /notify & JWT middleware
router.post('/read', markAsRead);

export default router;
