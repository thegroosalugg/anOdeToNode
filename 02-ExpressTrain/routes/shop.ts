import express from 'express';
import { getItems } from '../controllers/shop';

const router = express.Router();

router.get('/', getItems);

export default router;
