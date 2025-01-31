import Post from './Post';
import User from './User';

type Reply = {
        _id: string;
    content: string;
  updatedAt: string;
       post: Post;
    creator: User;
};

export default Reply;
