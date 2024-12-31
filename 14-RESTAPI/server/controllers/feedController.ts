import { RequestHandler } from 'express';

const getPosts: RequestHandler = (req, res, next) => {
  res
    .status(200)
    .json([{ _id: '1', title: 'First Post', content: 'This is the  first post!' }]);
};

const newPost: RequestHandler = (req, res, next) => {
  const { subject, content } = req.body;
  res.status(201).json({
    _id: new Date().toISOString(),
    subject,
    content,
  });
};

export { getPosts, newPost };
