import User from "./User";

type Post = {
        _id: string;
      title: string;
    content: string;
    imgURL?: string;
  updatedAt: string;
    creator: User;
};

export default Post;
