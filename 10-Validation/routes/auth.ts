import express from 'express';
import { getLogin, postLogin, postLogout, postSignup, postReset, postNewPassword } from '../controllers/auth';
import { validatePassword, validateSignUp } from '../validation/validators';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post('/signup', validateSignUp, postSignup);
router.post('/reset', postReset);
router.post('/password', validatePassword, postNewPassword);

export default router;
