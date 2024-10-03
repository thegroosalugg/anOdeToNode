import express from "express";
import html from "../pages";
import { home, homeCSS } from "../pages/home";

const router = express.Router();

router.get('/', (req, res, next) => {
  const { station } = req.query;
  res.send(html(homeCSS, home(station as string)));
});

export default router;
