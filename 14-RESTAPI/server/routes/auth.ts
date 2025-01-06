import express from "express";
import { postLogin, postSignup } from "../controllers/authController";
import { validateSignUp } from "../validation/validators";

const router = express.Router();

router.post('/login', postLogin);
router.post('/signup', validateSignUp, postSignup);

export default router;
