import { RequestHandler } from 'express';
import Station from '../model/station';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { homeCSS, home } from '../views/home';

const stations: Station[] = [];

const getStations: RequestHandler = (req, res, next) => {
  console.log(stations); // *logData
  res.send(html({ css: homeCSS, content: home(stations), title: 'Express Train', isActive: '/' }));
};

const getAddStation: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form, title: 'Go To Station', isActive: '/express' }));
};

const postAddStation: RequestHandler = (req, res, next) => {
  const station = req.body.station.trim();
  if (station) {
    stations.push({ name: station });
    res.redirect('/');
  }
};

export { getStations, getAddStation, postAddStation };
