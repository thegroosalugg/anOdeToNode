import express from 'express';
import html from '../views';
import { home, homeCSS } from '../views/home';

const router = express.Router();

router.get('/', (req, res, next) => {
  const { station } = req.query;
  res.send(html({ css: homeCSS, content: home(station as string), isActive: '/' }));
});

export default router;
