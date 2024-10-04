import express from "express";
import html from '../pages/index'
import { formCSS, form } from "../pages/form";

const router = express.Router();

router.use('/train', (req, res, next) => {
  res.send(html(formCSS, form));
});

router.post('/station', (req, res, next) => {
  console.log(req.body);
  const station = req.body.station;
  res.redirect(`/?station=${station}`); // Attach 'station' as a query parameter and redirect
});

export default router;
