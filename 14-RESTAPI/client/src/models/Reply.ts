import Post from './Post';
import User from './User';

export type Reply = {
        _id: string;
    content: string;
  updatedAt: string;
    creator: User;
       post: Post;
};
