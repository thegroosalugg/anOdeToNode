import express from "express";
import { postLogin, postSignup, refreshToken } from "../controllers/authController";
import { validateSignUp } from "../validation/validators";

const router = express.Router();

router.post('/login',                    postLogin);
router.post('/signup',  validateSignUp, postSignup);
router.post('/refresh-token',         refreshToken);

export default router;
