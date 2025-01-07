import express from "express";
import { getUser, postLogin, postSignup } from "../controllers/authController";
import { validateSignUp } from "../validation/validators";

const router = express.Router();

router.get('/user', getUser);
router.post('/login', postLogin);
router.post('/signup', validateSignUp, postSignup);

export default router;
