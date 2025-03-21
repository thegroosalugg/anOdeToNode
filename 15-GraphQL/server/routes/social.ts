import express from 'express';
import { getUsers, getUserById, friendRequest } from '../controllers/socialController';
import { getPosts } from '../controllers/feedController';

const router = express.Router();

// all routes prepended by /social & JWT middleware
router.get('/users',                 getUsers);
router.get('/find/:userId',       getUserById);
router.get('/posts/:userId',         getPosts);
router.post('/:userId/:action', friendRequest);

export default router;
