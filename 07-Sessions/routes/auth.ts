import express from 'express';
import { getLogin, postLogin } from '../controllers/auth';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);

export default router;
