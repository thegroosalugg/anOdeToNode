import { createContext, useContext, MutableRefObject } from "react";
import { FetchError, SetData } from "@/lib/types/common";
import { Auth } from "@/lib/types/auth";
import { ReqHandler } from "@/lib/hooks/useFetch";
import Chat from "@/models/Chat";
import Msg from "@/models/Message";
import User from "@/models/User";

export type   MsgsMap = Record<string, Msg[]>;
export type StatusMap = Record<string, boolean>;

type ChatContext = {
           user: User,
        setUser: Auth['setUser']
          chats: Chat[];
       setChats: SetData<Chat[]>;
       reqChats: ReqHandler<Chat[]>;
      isLoading: boolean;
          error: FetchError | null;
        msgsMap: MsgsMap;
        setMsgs: SetData<MsgsMap>;
      loadedMap: MutableRefObject<StatusMap>;
     activeChat: Chat | null;
  setActiveChat: SetData<Chat | null>;
      deferring: boolean;
         alerts: number;
      setAlerts: SetData<number>
    clearAlerts: (id: string) => Promise<void>;
         isOpen: boolean;
       openMenu: () => void;
      closeMenu: () => void;
       collapse: () => void;
      isMarking: boolean;
      markedMap: StatusMap;
   expandOrMark: (chat: Chat, path: string) => void;
  confirmAction: () => void;
   cancelAction: () => void;
   deleteAction: () => void;
      showModal: boolean;
     closeModal: () => void;
};

export const ChatContext = createContext<ChatContext | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be wrapped by ChatProvider");
  return ctx;
}
