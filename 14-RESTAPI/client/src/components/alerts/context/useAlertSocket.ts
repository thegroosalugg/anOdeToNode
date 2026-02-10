import { useEffect } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import { useAlerts } from "./AlertsContext";
import { api } from "@/lib/http/endpoints";
import Logger from "@/models/Logger";

export const useAlertSocket = () => {
  const {
           user,
        setUser,
     setReplies,
     reqReplies,
    readReplies,
    readSocials,
         isOpen,
      activeTab,
  } = useAlerts();
  const socketRef = useSocket("alerts");

  useEffect(() => {
    reqReplies({ url: api.alerts.readReplies({}) });
  }, [reqReplies]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger("alerts");
    socket.on("connect", () => logger.connect());

    const socialChannel = `peer:${user._id}:update`;
    const  replyChannel =  `nav:${user._id}:reply`;

    socket.on(socialChannel, async (updated) => {
      logger.event("peer:update", updated);
      if (isOpen && activeTab < 2) {
        await readSocials();
      } else {
        setUser(updated);
      }
    });

    socket.on(replyChannel, async ({ action, reply }) => {
      logger.event(`reply, action: ${action}`, reply);
      if (isOpen && activeTab === 2) {
        await readReplies();
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
      socket.off(socialChannel);
      socket.off(replyChannel);
    };
  }, [
      socketRef,
         isOpen,
      activeTab,
       user._id,
        setUser,
     setReplies,
     reqReplies,
    readSocials,
    readReplies,
  ]);
};
