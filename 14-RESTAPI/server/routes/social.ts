import express from 'express';
import { getUsers, getUserById, sendFriendReq } from '../controllers/socialController';
import { getPosts } from '../controllers/feedController';

const router = express.Router();

// all routes prepended by /social & JWT middleware
router.get('/users', getUsers);
router.get('/find/:userId', getUserById);
router.get('/posts/:userId', getPosts);
router.post('/add/:userId', sendFriendReq);

export default router;
