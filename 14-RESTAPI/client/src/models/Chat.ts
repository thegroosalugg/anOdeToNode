import { RecordMap } from "@/lib/types/common";
import Msg from "./Message";
import User from "./User";

const generateId = () => {
  if (crypto.randomUUID) return crypto.randomUUID(); // doesn't work when port forwarding to mobile device
  return Math.random().toString(36).slice(2);
};

class Chat {
         _id: string = generateId();
        host: User;
       guest: User;
     lastMsg: Msg = new Msg();
      isTemp: boolean = true;
     chatId?: string; // stores real chatID inside temp chat
      alerts: RecordMap<number> = {};
  deletedFor: RecordMap<boolean> = {};

  constructor(user: User, peer: User) {
    this.host  = user;
    this.guest = peer;
  }
}

export default Chat;
