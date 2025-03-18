import Post from './Post';
import User from './User';

type Reply = {
        _id: string;
    content: string;
  createdAt: string;
       post: Post;
    creator: User;
       meta: { read: boolean, show: boolean }
};

export default Reply;
