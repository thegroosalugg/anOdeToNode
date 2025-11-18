import express from 'express';
import { getAbout, getTerms } from '../controllers/static';

const router = express.Router();

router.get('/about', getAbout);
router.get('/terms', getTerms);

export default router;
