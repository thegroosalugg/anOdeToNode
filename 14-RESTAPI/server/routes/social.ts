import express from "express";
import { getUsers, getUserById } from "../controllers/socialController";

const router = express.Router();

// all routes prepended by /social & JWT middleware
router.get('/users', getUsers);
router.get('/find/:userId', getUserById);

export default router;
