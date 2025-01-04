import User from "./User";

type Post = {
        _id: string;
      title: string;
    content: string;
    imgURL?: string;
  updatedAt: string;
     author: User;
};

export default Post;
