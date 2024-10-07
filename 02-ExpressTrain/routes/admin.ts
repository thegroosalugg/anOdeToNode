import express from 'express';
import { getAddStation, postAddStation } from '../controllers/admin';

const router = express.Router();

// all routes prepend with /express
router.get('/train', getAddStation);
router.post('/station', postAddStation);

export default router;
