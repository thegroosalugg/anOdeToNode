import express from "express";
import form from '../pages/index'

const router = express.Router();

router.use('/express-train', (req, res, next) => {
  res.send(form);
});

router.post('/station', (req, res, next) => {
  console.log(req.body);
  const station = req.body.station;
  res.redirect(`/?station=${station}`); // Attach 'station' as a query parameter and redirect
});

export default router;
