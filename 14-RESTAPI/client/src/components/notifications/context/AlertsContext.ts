import { createContext, useContext } from "react";
import { Debounce } from "@/lib/hooks/useDebounce";
import { FetchError } from "@/lib/types/common";
import { UserState } from "@/lib/types/auth";
import { FetchState } from "@/lib/types/fetch";
import Reply from "@/models/Reply";

type UserControl = UserState & { onError: (err: FetchError) => void };

type ReplyData = Omit<FetchState<Reply[], "replies">, "reqReplies" | "setError">;

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
  // alerts: number[];
  alerts: AlertCounts;
  navTo: (path: string) => void;
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
