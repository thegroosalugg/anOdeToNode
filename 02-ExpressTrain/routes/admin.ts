import express from 'express';
import { getAddCard, postAddCard } from '../controllers/admin';

const router = express.Router();

// all routes prepend with /admin
router.get('/card', getAddCard);
router.post('/add-card', postAddCard);

export default router;
