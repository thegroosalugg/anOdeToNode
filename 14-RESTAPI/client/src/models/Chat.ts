import { Dict } from "@/lib/types/common";
import Msg from "./Message";
import User from "./User";

class Chat {
         _id: string = crypto.randomUUID();
        host: User;
       guest: User;
     lastMsg: Msg = new Msg();
      isTemp: boolean = true;
     chatId?: string; // stores real chatID inside temp chat
      alerts: Dict<number> = {};
  deletedFor: Dict<boolean> = {};

  constructor(user: User, peer: User) {
    this.host  = user;
    this.guest = peer;
  }
}

export default Chat;
