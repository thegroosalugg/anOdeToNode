import express from "express";
import html from '../views/index'
import { formCSS, form } from "../views/form";

const router = express.Router();

router.use('/train', (req, res, next) => {
  res.send(html({ css: formCSS, content: form, isActive: '/express' }));
});

router.post('/station', (req, res, next) => {
  console.log(req.body);
  const station = req.body.station;
  res.redirect(`/?station=${station}`); // Attach 'station' as a query parameter and redirect
});

export default router;
