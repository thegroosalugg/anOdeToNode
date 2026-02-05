import { useState, ReactNode, useCallback, useMemo } from "react";
import { AlertCounts, AlertsContext } from "./AlertsContext";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { usePages } from "@/lib/hooks/usePages";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import { UserState } from "@/lib/types/auth";
import User from "@/models/User";
import Reply from "@/models/Reply";
import Friend from "@/models/Friend";

interface AlertsProvider extends UserState {
  children: ReactNode;
}

export function AlertsProvider({ user, setUser, children }: AlertsProvider) {
  const { data: replies, setData: setReplies, reqData: reqReplies } = useFetch<Reply[]>([]);
  const {            reqData: reqReply   } = useFetch<Reply | null>();
  const { error,     reqData: reqSocials } = useFetch<User>();
  const { deferring,             deferFn } = useDebounce();
  const { current, direction, changePage } = usePages();
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

  const markSocials = useCallback(
    async (index = current) =>
      await reqSocials({
              url: `alerts/social?type=${["inbound", "outbound"][index]}`,
        onSuccess: (updated) => setUser(updated),
      }),
    [current, reqSocials, setUser],
  );

  const markReplies = useCallback(
    async () => await reqReplies({ url: "alerts/replies?read=true" }),
    [reqReplies]
  );

  const handleAlerts = async (index = current) => {
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
    }, 1000);
  };

  const closeMenu = () => setIsOpen(false);

  const changeTab = async (index: number) => {
    changePage(((index % 3) + 3) % 3); // clamps between 0-2
    await handleAlerts(index);
  };

  const navTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const friendRequest = async (_id: string, action: "accept" | "delete") => {
    deferFn(async () => {
      await reqSocials({ url: `social/${_id}/${action}`, method: "POST" });
    }, 1000);
  };

  const clearSocial = async (_id: string) => {
    deferFn(async () => {
      await reqSocials({ url: `alerts/social/hide/${_id}`, onSuccess: (updated) => setUser(updated) });
    }, 1000);
  };

  const clearReply = async (_id: string) => {
    deferFn(async () => {
      await reqReply({
              url: `alerts/reply/hide/${_id}`,
        onSuccess: (updated) => setReplies((prev) => prev.filter(({ _id }) => updated?._id !== _id)),
      });
    }, 1000);
  };

  useDepedencyTracker("alerts", {
           isOpen,
          current,
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
    markReplies,
    markSocials,
    clearSocial,
    clearReply,
    friendRequest,
    error,
    count,
    alerts,
    isOpen,
    openMenu,
    closeMenu,
    activeTab: current,
    direction,
    changeTab,
    navTo,
    deferring,
  };

  return <AlertsContext.Provider value={ctxValue}>{children}</AlertsContext.Provider>;
}
