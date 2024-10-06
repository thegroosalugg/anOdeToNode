import express from 'express';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import Station from '../model/station';

const router = express.Router();

const stations: Station[] = [];

router.use('/train', (req, res, next) => {
  res.send(html({ css: formCSS, content: form, title: 'Go To Station', isActive: '/express' }));
});

router.post('/station', (req, res, next) => {
  const station = req.body.station.trim();
  if (station) {
    stations.push({ name: station });
    res.redirect('/');
  }
});

export { stations, router };
