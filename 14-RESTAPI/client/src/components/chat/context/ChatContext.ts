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

export type  MsgState = Record<string, Msg[]>;
export type LoadState = Record<string, boolean>;

type ChatContext = {
         user: User,
      setUser: Auth['setUser']
        chats: Chat[];
     msgState: MsgState;
    loadState: MutableRefObject<LoadState>;
      setMsgs: Dispatch<SetStateAction<MsgState>>;
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
} & Debounce;

export const ChatContext = createContext<ChatContext | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be wrapped by ChatProvider");
  return ctx;
}
