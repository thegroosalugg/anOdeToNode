import express from "express";
import { getLogin, postSignup } from "../controllers/authController";
import { validateSignUp } from "../validation/validators";

const router = express.Router();

router.get('/login', getLogin);
router.post('/signup', validateSignUp, postSignup);

export default router;
