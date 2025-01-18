import Reply from './Reply';
import User from './User';

type Post = {
        _id: string;
      title: string;
    content: string;
    imgURL?: string;
  updatedAt: string;
    creator: User;
    replies: Reply[];
};

export default Post;
