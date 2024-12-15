import express from 'express';
import { getLogin, postLogin, postLogout, postSignup, postReset } from '../controllers/auth';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post('/signup', postSignup);
router.post('/reset', postReset);

export default router;
