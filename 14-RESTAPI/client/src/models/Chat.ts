import Msg from "./Message";
import User from "./User";

type Chat = {
         _id:  string;
        host:  User;
       guest:  User;
  deletedFor: [string];
     lastMsg:  Msg;
};

export default Chat;
