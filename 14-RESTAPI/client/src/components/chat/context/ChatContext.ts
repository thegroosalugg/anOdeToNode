import { createContext, useContext, MutableRefObject } from "react";
import { Dict, SetData } from "@/lib/types/common";
import { Auth } from "@/lib/types/auth";
import { Debounce } from "@/lib/hooks/useDebounce";
import Chat from "@/models/Chat";
import Msg from "@/models/Message";
import User from "@/models/User";
import { FetchState } from "@/lib/types/fetch";

export type   MsgsMap = Dict<Msg[]>;
export type StatusMap = Dict<boolean>;

type ChatData = FetchState<Chat[], "chats">

type MessageData = {
    msgsMap: MsgsMap;
    setMsgs: SetData<MsgsMap>;
  loadedMap: MutableRefObject<StatusMap>;
};

type MenuControl = {
     isOpen: boolean;
   openMenu: () => void;
  closeMenu: () => void;
};

type ChatControl = {
     activeChat: Chat | null;
  setActiveChat: SetData<Chat | null>;
       collapse: () => void; // expand is bound with Mark => expandOrMark: declatative action
}

type ModalControl = {
   showModal: boolean;
  closeModal: () => void;
};

type ActionControl = {
      isMarking: boolean;
      markedMap: StatusMap;
   expandOrMark: (chat: Chat, path: string) => void;
  confirmAction: () => void;
   cancelAction: () => void;
   deleteAction: () => void;
};

type AlertsControl = {
       alerts: number;
    setAlerts: SetData<number>;
  clearAlerts: (id: string) => Promise<void>;
}

type ChatContext = {
       user: User;
    setUser: Auth["setUser"];
  deferring: Debounce["deferring"];
}    & ChatData &
    MessageData &
    ChatControl &
    MenuControl &
   ModalControl &
  ActionControl &
  AlertsControl;
export const ChatContext = createContext<ChatContext | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be wrapped by ChatProvider");
  return ctx;
}
