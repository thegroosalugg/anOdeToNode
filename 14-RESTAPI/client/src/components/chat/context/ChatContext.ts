import { createContext, useContext, MutableRefObject } from "react";
import { Dict, SetData } from "@/lib/types/common";
import { Authorized } from "@/lib/types/auth";
import { Debounce } from "@/lib/hooks/useDebounce";
import { FetchState } from "@/lib/types/fetch";
import Chat from "@/models/Chat";
import Msg from "@/models/Message";

export type   MsgsMap = Dict<Msg[]>;
export type StatusMap = Dict<boolean>;
export type  UserData = Pick<Authorized, "user" | "setUser">;

type ChatData = Omit<FetchState<Chat[], "chats">, "setError">;

type MessageData = {
    msgsMap: MsgsMap;
    setMsgs: SetData<MsgsMap>;
  loadedMap: StatusMap;
  setLoaded: SetData<StatusMap>;
};

type MenuControl = {
     isOpen: boolean;
  setIsOpen: SetData<boolean>;
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

type ChatContext =
       UserData &
       ChatData &
    MessageData &
    ChatControl &
    MenuControl &
   ModalControl &
  ActionControl &
  AlertsControl &
  Pick<Debounce, "deferring">;

export const ChatContext = createContext<ChatContext | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be wrapped by ChatProvider");
  return ctx;
}
