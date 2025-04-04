import express from "express";
import { getUser, postLogin, postSignup, refreshToken } from "../controllers/authController";
import { validateSignUp } from "../validation/validators";
import { authJWT } from "../middleware/auth.JWT";

const router = express.Router();

router.get('/user',            authJWT,    getUser);
router.post('/login',                    postLogin);
router.post('/signup',  validateSignUp, postSignup);
router.post('/refresh-token',         refreshToken);

export default router;
