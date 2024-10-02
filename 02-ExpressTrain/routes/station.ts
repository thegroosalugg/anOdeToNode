import express from "express";

const router = express.Router();

router.get('/', (req, res, next) => {
  const { station } = req.query;
  res.send(
    `<h1>${station ? station + '🏭' : 'You are Home 🏡'}</h1><a href='/express-train'>Take the Express</a>`
  );
});

export default router;
