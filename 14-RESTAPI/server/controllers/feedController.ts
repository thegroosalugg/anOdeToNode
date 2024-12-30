import { RequestHandler } from 'express';

const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({ message: 'never mind' });
};

const newPost: RequestHandler = (req, res, next) => {
  const { subject, content } = req.body;
  res.status(201).json({
    message: 'Success',
    post: {
      id: new Date().toISOString,
      subject,
      content,
    },
  });
};

export { getPosts, newPost };
