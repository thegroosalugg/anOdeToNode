import User from './User';

type Reply = {
        _id: string;
    content: string;
  updatedAt: string;
       post: string; // id string only stored to find Post
    creator: User;   // Backend populates creator ID with User object
};

export default Reply;
