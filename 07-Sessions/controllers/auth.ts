import { RequestHandler } from 'express';

const getLogin: RequestHandler = async (req, res, next) => {
  res.render('body', {
       title: 'Login',
    isActive: '/login',
        view: 'login',
      styles: ['login'],
      locals: {},
  })
};

const postLogin: RequestHandler = async (req, res, next) => {

};

export { getLogin, postLogin };
