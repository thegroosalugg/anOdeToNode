import express from "express";
import { getUsers } from "../controllers/socialController";

const router = express.Router();

// all routes prepended by /social & JWT middleware
router.get('/users', getUsers)

export default router;
