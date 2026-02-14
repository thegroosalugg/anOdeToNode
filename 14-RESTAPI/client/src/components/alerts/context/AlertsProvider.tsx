import { useState, ReactNode, useCallback, useMemo } from "react";
import { AlertCounts, AlertsContext } from "./AlertsContext";
import { api } from "@/lib/http/endpoints";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { usePages } from "@/lib/hooks/usePages";
import { useDefer } from "@/lib/hooks/useDefer";
import { useDependencyTracker } from "@/lib/hooks/useDependencyTracker";
import { UserState } from "@/lib/types/interface";
import { Routes } from "@/routes/paths";
import User from "@/models/User";
import Reply from "@/models/Reply";
import Friend from "@/models/Friend";

interface AlertsProvider extends UserState {
  children: ReactNode;
}

export function AlertsProvider({ user, setUser, children }: AlertsProvider) {
  const { currentPage,        direction,         setPageDirection } = usePages();
  const { data: replies, setData: setReplies, reqData: reqReplies } = useFetch<Reply[]>([]);
  const {            reqData: reqReply   } = useFetch<Reply | null>();
  const { error,     reqData: reqSocials } = useFetch<User>();
  const { deferring,               defer } = useDefer();
  const [isOpen,                setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { inboundReqs, outboundReqs, inboundCount, outboundCount } = useMemo(() => {
    const  inboundReqs: Friend[] = [];
    const outboundReqs: Friend[] = [];
    let  inboundCount = 0;
    let outboundCount = 0;

    user.friends.forEach((friend) => {
      const { initiated, accepted, meta } = friend;
      if (!meta.show) return;

      if (!initiated) inboundReqs.push(friend);
      else outboundReqs.push(friend);

      if (!meta.read) {
        if (    !initiated       ) inboundCount++;
        if (accepted && initiated) outboundCount++;
      }
    });

    return {
        inboundReqs:  inboundReqs.reverse(),
       outboundReqs: outboundReqs.reverse(),
       inboundCount,
      outboundCount,
    };
  }, [user.friends]);

  const newReplies = useMemo(() => {
    return replies.reduce((total, { meta }) => {
      if (!meta.read) total += 1;
      return total;
    }, 0);
  }, [replies]);

  const  count = inboundCount + outboundCount + newReplies;
  const alerts = [inboundCount, outboundCount,  newReplies] as AlertCounts;

  const readSocials = useCallback(
    async (index = currentPage) =>
      await reqSocials({
              url:  api.alerts.readSocial({ query: (["inbound", "outbound"] as const)[index] }),
        onSuccess: (updated) => setUser(updated),
      }),
    [currentPage, reqSocials, setUser],
  );

  const readReplies = useCallback(
    async () => await reqReplies({ url: api.alerts.readReplies({ read: true }) }),
    [reqReplies],
  );

  const handleAlerts = async (index = currentPage) => {
    if (alerts[index] > 0) {
      if (index < 2) {
        await readSocials(index);
      } else {
        await readReplies();
      }
    }
  };

  const openMenu = async () => {
    defer(async () => {
      setIsOpen(true);
      await handleAlerts();
    }, 1000);
  };

  const closeMenu = () => setIsOpen(false);

  const changeTab = async (index: number) => {
    setPageDirection(((index % 3) + 3) % 3); // clamps between 0-2
    await handleAlerts(index);
  };

  const navTo = (path: Routes) => {
    setIsOpen(false);
    navigate(path);
  };

  const friendRequest = async (id: string, action: "accept" | "delete") => {
    defer(async () => {
      await reqSocials({ url: api.social.request({ id, action }), method: "POST" });
    }, 1000);
  };

  const clearSocial = async (id: string) => {
    defer(async () => {
      await reqSocials({ url: api.alerts.clearSocial(id), onSuccess: (updated) => setUser(updated) });
    }, 1000);
  };

  const clearReply = async (id: string) => {
    defer(async () => {
      await reqReply({
              url: api.alerts.clearReply(id),
        onSuccess: (updated) => setReplies((prev) => prev.filter(({ _id }) => updated?._id !== _id)),
      });
    }, 1000);
  };

  useDependencyTracker("alerts", {
           isOpen,
      currentPage,
      inboundReqs,
     outboundReqs,
     inboundCount,
    outboundCount,
       newReplies,
          reqUser: user._id,
  });

  const ctxValue = {
    user,
    setUser,
    inboundReqs,
    outboundReqs,
    replies,
    setReplies,
    reqReplies,
    readReplies,
    readSocials,
    clearSocial,
    clearReply,
    friendRequest,
    error,
    count,
    alerts,
    isOpen,
    openMenu,
    closeMenu,
    activeTab: currentPage,
    direction,
    changeTab,
    navTo,
    deferring,
  };

  return <AlertsContext.Provider value={ctxValue}>{children}</AlertsContext.Provider>;
}
