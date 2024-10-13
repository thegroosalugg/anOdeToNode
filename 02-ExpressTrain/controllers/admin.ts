import { RequestHandler } from 'express';
import Board from '../models/Board';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { homeCSS, home } from '../views/home';

const getBoards: RequestHandler = (req, res, next) => {
  const boards = Board.fetchAll((boards: Board[]) => {
    console.log(boards); // *logData
    res.send(html({ css: homeCSS, content: home(boards), title: 'Express Train', isActive: '/' }));
  });
};

// /admin/board
const getAddBoard: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form, title: 'See Boards', isActive: '/admin/board' }));
};

// /admin/add-board
const postAddBoard: RequestHandler = (req, res, next) => {
  const name = req.body.name.trim();
  if (name) {
    const board = new Board(name, 'description', 'image', 1);
    board.save();
    res.redirect('/');
  }
};

export { getBoards, getAddBoard, postAddBoard };
