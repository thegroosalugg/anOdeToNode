import { useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCounts, AlertsContext } from "./AlertsContext";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import { UserState } from "@/lib/types/auth";
import { FetchError } from "@/lib/types/common";
import User from "@/models/User";
import Reply from "@/models/Reply";

interface AlertsProvider extends UserState {
  children: ReactNode;
}

export function AlertsProvider({ user, setUser, children }: AlertsProvider) {
  const { error, reqData: reqSocials } = useFetch<User>();
  const {
         data: replies,
      setData: setReplies,
      reqData: reqReplies,
    isLoading,
  } = useFetch<Reply[]>([]);
  const [isOpen,       setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { deferring,    deferFn } = useDebounce();
  const   navigate  = useNavigate();
  const { friends } = user;

  const [inbound, outbound] = friends.reduce(
    ([inTotal, outTotal], { initiated, accepted, meta }) => {
      if (!meta.read) {
        if (     !initiated      )  inTotal += 1;
        if (accepted && initiated) outTotal += 1;
      }
      return [inTotal, outTotal];
    },
    [0, 0]
  );

  const newReplies = replies.reduce((total, { meta }) => {
    if (!meta.read) total += 1;
    return total;
  }, 0);

  const  count = inbound + outbound + newReplies;
  const alerts = [inbound, outbound, newReplies] as AlertCounts;

  const markSocials = useCallback(
    async (index = activeTab) =>
      await reqSocials(
        { url: `alerts/social?type=${["inbound", "outbound"][index]}` },
        { onSuccess: (updated) => setUser(updated) }
      ),
    [activeTab, reqSocials, setUser]
  );

  const markReplies = useCallback(
    async () => await reqReplies({ url: "alerts/replies?read=true" }),
    [reqReplies]
  );

  const handleAlerts = async (index = activeTab) => {
    if (alerts[index] > 0) {
      if (index < 2) {
        await markSocials(index);
      } else {
        await markReplies();
      }
    }
  };

  const openMenu = async () => {
    deferFn(async () => {
      setIsOpen(true);
      await handleAlerts();
    }, 1500);
  };

  const closeMenu = () => setIsOpen(false);

  const changeTab = async (index: number) => {
    setActiveTab(index);
    await handleAlerts(index);
  };

  const navTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const onError = (err: FetchError) => {
    if (err.status === 401) setUser(null);
  };

  useDepedencyTracker("alerts", {
    isLoading,
    isOpen,
    activeTab,
    reqUser: user._id,
  });

  const ctxValue = {
    user,
    setUser,
    onError,
    replies,
    setReplies,
    reqReplies,
    markReplies,
    markSocials,
    isLoading,
    error,
    count,
    alerts,
    isOpen,
    openMenu,
    closeMenu,
    activeTab,
    changeTab,
    navTo,
    deferring,
  };

  return <AlertsContext.Provider value={ctxValue}>{children}</AlertsContext.Provider>;
}
