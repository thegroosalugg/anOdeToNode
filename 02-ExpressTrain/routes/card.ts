import express from 'express';
import { getCards } from '../controllers/admin';

const router = express.Router();

router.get('/', getCards);

export default router;
