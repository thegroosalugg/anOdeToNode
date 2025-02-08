import User from "./User";

type Chat = {
         _id:  string;
        user:  User;
        peer:  User;
  deletedFor: [string];
};

export default Chat;
