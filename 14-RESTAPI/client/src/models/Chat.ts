import Msg from "./Message";
import User from "./User";

type Chat = {
         _id:  string;
        host:  User;
       guest:  User;
     lastMsg:  Msg;
      alerts:  Record<string,  number>;
  deletedFor:  Record<string, boolean>;
};

export default Chat;
