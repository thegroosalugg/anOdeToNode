import express from 'express';
import { getLogin, postLogin, postLogout, postSignup, postReset, postNewPassword } from '../controllers/auth';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post('/signup', postSignup);
router.post('/reset', postReset);
router.post('/password', postNewPassword);

export default router;
