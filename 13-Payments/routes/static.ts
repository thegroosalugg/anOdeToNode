import express from 'express';
import { getAbout, getTerms, getPrivacy } from '../controllers/static';

const router = express.Router();

router.get('/about', getAbout);
router.get('/terms', getTerms);
router.get('/privacy', getPrivacy);

export default router;
