import { RequestHandler } from "express";

const getAbout: RequestHandler = (req, res, next) => {
  res.render('body', {
         title: 'About D-Bay',
     activeNav: '',
    activeDash: '',
          view:  'static/about',
        styles: ['static/static'],
        locals: {},
  });
}

const getTerms: RequestHandler = (req, res, next) => {
  res.render('body', {
         title: 'Terms & Conditions',
     activeNav: '',
    activeDash: '',
          view:  'static/terms',
        styles: ['static/static'],
        locals: {},
  });
}

export { getAbout, getTerms };
