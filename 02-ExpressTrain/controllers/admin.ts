import { RequestHandler } from 'express';
import Board from '../models/Board';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { shopCSS, shop } from '../views/shop';

const getBoards: RequestHandler = (req, res, next) => {
  const boards = Board.fetchAll((boards: Board[]) => {
    console.log(boards); // *logData
    res.send(html({ css: shopCSS, content: shop(boards), title: 'Express Train', isActive: '/' }));
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
    const board = new Board(name, 'description', '/images/board_red_blue.png', 500);
    board.save();
    res.redirect('/');
  }
};

export { getBoards, getAddBoard, postAddBoard };
