import { Meta } from '@/lib/types/common';
import Post from './Post';
import User from './User';

type Reply = {
        _id: string;
    content: string;
  createdAt: string;
       post: Post;
    creator: User;
       meta: Meta;
};

export default Reply;
