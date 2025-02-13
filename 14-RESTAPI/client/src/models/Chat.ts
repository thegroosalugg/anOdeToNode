import Msg from "./Message";
import User from "./User";

type Chat = {
         _id:  string;
        user:  User;
        peer:  User;
  deletedFor: [string];
     lastMsg:  Msg;
};

export default Chat;
