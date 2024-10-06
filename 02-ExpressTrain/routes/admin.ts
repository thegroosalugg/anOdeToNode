import express from 'express';
import { getAddStation, postAddStation } from '../controllers/admin';

const router = express.Router();

router.get('/train', getAddStation);
router.post('/station', postAddStation);

export default router;
