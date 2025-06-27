import { Debounce } from "@/lib/hooks/useDebounce";
import { FetchError } from "@/lib/util/fetchData";
import Chat from "@/models/Chat";
import Msg from "@/models/Message";
import User from "@/models/User";
import { Auth } from "@/pages/RootLayout";
import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
} from "react";

export type   MsgsMap = Record<string, Msg[]>;
export type StatusMap = Record<string, boolean>;

type ChatContext = {
           user: User,
        setUser: Auth['setUser']
          chats: Chat[];
        msgsMap: MsgsMap;
      loadedMap: MutableRefObject<StatusMap>;
        setMsgs: Dispatch<SetStateAction<MsgsMap>>;
          error: FetchError | null;
       isActive: Chat | null;
      isInitial: boolean;
         alerts: number;
    clearAlerts: (id: string) => Promise<void>;
         isOpen: boolean;
       openMenu: () => void;
      closeMenu: () => void;
         expand: (chat: Chat, path: string) => void;
       collapse: () => void;
      isMarking: boolean;
      markedMap: StatusMap;
   expandOrMark: (chat: Chat, path: string) => void;
  confirmAction: () => void;
   cancelAction: () => void;
   deleteAction: () => void;
      showModal: boolean;
     closeModal: () => void;
} & Debounce;

export const ChatContext = createContext<ChatContext | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be wrapped by ChatProvider");
  return ctx;
}
