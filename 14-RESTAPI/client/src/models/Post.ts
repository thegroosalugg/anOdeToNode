import User from "./User";

type Post = {
      _id: string;
    title: string;
  content: string;
  imgURL?: string;
     user: User;
};

export default Post;
