import express from 'express';
import { getItems } from '../controllers/store';

const router = express.Router();

router.get('/', getItems);

export default router;
