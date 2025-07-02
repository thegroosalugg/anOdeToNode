import { createContext, useContext } from "react";
import { Debounce } from "@/lib/hooks/useDebounce";
import { FetchError } from "@/lib/types/common";
import { Authorized } from "@/lib/types/auth";
import { FetchState } from "@/lib/types/fetch";
import Reply from "@/models/Reply";
import User from "@/models/User";

type UserControl = Pick<Authorized, "user" | "setUser" | "error"> & {
  onError: (err: FetchError) => void;
};

type ReplyData = Pick<
  FetchState<Reply[], "replies">,
  "replies" | "setReplies" | "reqReplies"
>;

type MenuControl = {
     isOpen: boolean;
   openMenu: () => void;
  closeMenu: () => void;
  activeTab: number;
  changeTab: (index: number) => void;
};

export type AlertCounts = [inbound: number, outbound: number, newReplies: number];

type AlertsContext = {
         count: number;
        alerts: AlertCounts;
         navTo: (path:   string) => void;
   markSocials: (              ) => Promise<User    | void>;
   markReplies: (index?: number) => Promise<Reply[] | void>;
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
