import { useState, ReactNode, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCounts, AlertsContext } from "./AlertsContext";
import { useFetch } from "@/lib/hooks/useFetch";
import { useSocket } from "@/lib/hooks/useSocket";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import { UserState } from "@/lib/types/auth";
import { FetchError } from "@/lib/types/common";
import User from "@/models/User";
import Reply from "@/models/Reply";
import Logger from "@/models/Logger";

interface AlertsProvider extends UserState {
  children: ReactNode;
}

export function AlertsProvider({ user, setUser, children }: AlertsProvider) {
  const { error, reqData: reqSocialAlerts } = useFetch<User>();
  const {
       data: replies,
    setData: setReplies,
    reqData: reqReplyAlerts,
    isLoading,
  } = useFetch<Reply[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { deferring, deferFn } = useDebounce();
  const socketRef = useSocket("alerts");
  const navigate = useNavigate();
  const { friends } = user;
  const [inbound, outbound] = friends.reduce(
    ([inTotal, outTotal], { initiated, accepted, meta }) => {
      if (!meta.read) {
        if (!initiated) inTotal += 1;
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

  const count = inbound + outbound + newReplies;
  const alerts = [inbound, outbound, newReplies] as AlertCounts;

  const markSocialsAsRead = useCallback(
    async (index = activeTab) =>
      await reqSocialAlerts(
        { url: `alerts/social?type=${["inbound", "outbound"][index]}` },
        { onSuccess: (updated) => setUser(updated) }
      ),
    [activeTab, reqSocialAlerts, setUser]
  );

  const markRepliesAsRead = useCallback(
    async () => await reqReplyAlerts({ url: "alerts/replies?read=true" }),
    [reqReplyAlerts]
  );

  const handleAlerts = async (index = activeTab) => {
    if (alerts[index] > 0) {
      if (index < 2) {
        await markSocialsAsRead(index);
      } else {
        await markRepliesAsRead();
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
    socketRef,
    isOpen,
    activeTab,
    reqUser: user._id,
  });

  useEffect(() => {
    reqReplyAlerts({ url: "alerts/replies" });
  }, [reqReplyAlerts]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger("alerts");
    socket.on("connect", () => logger.connect());

    socket.on(`peer:${user._id}:update`, async (updated) => {
      logger.event("peer:update", updated);
      if (isOpen && activeTab < 2) {
        await markSocialsAsRead();
      } else {
        setUser(updated);
      }
    });

    socket.on(`nav:${user._id}:reply`, async ({ action, reply }) => {
      logger.event(`reply, action: ${action}`, reply);
      if (isOpen && activeTab === 2) {
        await markRepliesAsRead();
      } else {
        if (action === "new") {
          setReplies((prev) => [reply, ...prev]);
        } else if (action === "delete") {
          setReplies((prev) => prev.filter(({ _id }) => _id !== reply._id));
        }
      }
    });

    return () => {
      socket.off("connect");
      socket.off(`peer:${user._id}:update`);
      socket.off(`nav:${user._id}:reply`);
    };
  }, [
    socketRef,
    isOpen,
    activeTab,
    user._id,
    reqReplyAlerts,
    markSocialsAsRead,
    markRepliesAsRead,
    setUser,
    setReplies,
  ]);

  const ctxValue = {
    user,
    setUser,
    onError,
    replies,
    setReplies,
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
