import express from 'express';
import html from '../views';
import { home, homeCSS } from '../views/home';
import { stations } from './admin';

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(stations);
  res.send(html({ css: homeCSS, content: home(stations), isActive: '/' }));
});

export default router;
