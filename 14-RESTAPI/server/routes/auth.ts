import express from "express";
import { getLogin, postSignup } from "../controllers/authController";

const router = express.Router();

router.get('/login', getLogin);
router.post('/signup', postSignup);

export default router;
