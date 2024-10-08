import { RequestHandler } from 'express';
import Station from '../models/station';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { homeCSS, home } from '../views/home';

const getStations: RequestHandler = (req, res, next) => {
  const stations = Station.fetchAll((stations: Station[]) => {
    console.log(stations); // *logData
    res.send(html({ css: homeCSS, content: home(stations), title: 'Express Train', isActive: '/' }));
  });
};

// /express/train
const getAddStation: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form, title: 'Go To Station', isActive: '/express' }));
};

// /express/station
const postAddStation: RequestHandler = (req, res, next) => {
  const name = req.body.name.trim();
  if (name) {
    const station = new Station(name);
    station.save();
    res.redirect('/');
  }
};

export { getStations, getAddStation, postAddStation };
