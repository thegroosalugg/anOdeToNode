import express from 'express';
import { getBoards } from '../controllers/admin';

const router = express.Router();

router.get('/', getBoards);

export default router;
