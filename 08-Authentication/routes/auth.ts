import express from 'express';
import { getLogin, postLogin, postLogout, postSignup } from '../controllers/auth';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post('/signup', postSignup);

export default router;
