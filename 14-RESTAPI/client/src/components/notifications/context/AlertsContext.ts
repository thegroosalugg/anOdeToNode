import { createContext, useContext } from "react";
import { Debounce } from "@/lib/hooks/useDebounce";
import { Authorized } from "@/lib/types/auth";
import { FetchState } from "@/lib/types/fetch";
import { Direction } from "@/lib/types/common";
import Reply from "@/models/Reply";
import User from "@/models/User";
import Friend from "@/models/Friend";

type UserControl = Pick<Authorized, "user" | "setUser" | "error">;

type ReplyData = Pick<FetchState<Reply[], "replies">, "replies" | "setReplies" | "reqReplies">;

type MenuControl = {
     isOpen: boolean;
   openMenu: () => void;
  closeMenu: () => void;
  activeTab: number;
  direction: Direction;
  changeTab: (index: number) => void;
};

export type AlertCounts = [inboundCount: number, outboundCount: number, newReplies: number];

type AlertsContext = {
    inboundReqs: Friend[];
   outboundReqs: Friend[];
          count: number;
         alerts: AlertCounts;
          navTo: (path:   string) => void;
    markSocials: (              ) => Promise<User    | void>;
    markReplies: (index?: number) => Promise<Reply[] | void>;
    clearSocial: (_id:    string) => void;
     clearReply: (_id:    string) => void;
  friendRequest: (_id: string, action: "accept" | "delete") => void;
} & UserControl &
      ReplyData &
    MenuControl &
    Pick<Debounce, "deferring">;

export const AlertsContext = createContext<AlertsContext | null>(null);

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be wrapped by AlertsProvider");
  return ctx;
}
