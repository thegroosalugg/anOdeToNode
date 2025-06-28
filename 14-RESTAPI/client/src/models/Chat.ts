import { Dict } from "@/lib/types/common";
import Msg from "./Message";
import User from "./User";

type Chat = {
         _id:  string;
        host:  User;
       guest:  User;
     lastMsg:  Msg;
      isTemp:  boolean;
      alerts:  Dict<number>;
  deletedFor:  Dict<boolean>;
};

export default Chat;
