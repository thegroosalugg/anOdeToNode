import { useCallback, useEffect } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import { useChat } from "./ChatContext";
import Chat from "@/models/Chat";
import Logger from "@/models/Logger";

const config = "chat"; // logger/sockets

export const useChatSocket = () => {
  const {
    user,
    isOpen,
    chats,
    setChats,
    reqChats,
    activeChat,
    setActiveChat,
    setMsgs,
    setAlerts,
    clearAlerts,
  } = useChat();

  const socketRef = useSocket(config);

  const { _id: activeId, isTemp = false } = activeChat ?? {};
  const count = chats.reduce((total, { alerts }) => (total += alerts[user._id] || 0), 0);

  const updateChats = useCallback(
    (chat: Chat) => {
      setChats((prevChats) =>
        prevChats.map((prev) => (prev._id === chat._id ? chat : prev))
      );
    },
    [setChats]
  );

  useEffect(() => {
    reqChats({ url: "chat/all" });
  }, [reqChats]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    setAlerts(count);

    const logger = new Logger(config);
    socket.on("connect", () => logger.connect());

    socket.on(`chat:${user._id}:update`, async ({ chat, isNew, msg }) => {
      logger.event(`update, ChatIsNew? ${isNew}`, chat);

      const  isSender = user._id === msg.sender;
      const isVisible = chat._id === activeId && isOpen;

      if (isNew) {
        setChats((prevChats) => [chat, ...prevChats]);
      } else if ((isVisible || isTemp) && !isSender) {
        await clearAlerts(chat._id); // states updated by alerts socket
      } else {
        updateChats(chat);
      }

      setMsgs((state) => {
        const chatId = isTemp ? activeId : chat._id;
        return { ...state, [chatId]: [...(state[chatId] || []), msg] };
      });
    });

    socket.on(`chat:${user._id}:delete`, (deleted: Chat[]) => {
      logger.event("delete", deleted);
      const isDeleted = (id?: string) => deleted.some((chat) => chat._id === id);
      if (isDeleted(activeId)) setActiveChat(null);
      setChats((prevChats) => prevChats.filter((chat) => !isDeleted(chat._id)));
      setMsgs((state) => {
        // remove prev fetched client msgs when chat deleted
        const updated = deleted.reduce((acc, { _id }) => ({ ...acc, [_id]: [] }), {});
        return { ...state, ...updated };
      });
    });

    socket.on(`chat:${user._id}:alerts`, (chat) => {
      logger.event("alerts", chat);
      if (chat._id === activeId) setActiveChat(chat);
      updateChats(chat);
    });

    return () => {
      socket.off("connect");
      socket.off(`chat:${user._id}:update`);
      socket.off(`chat:${user._id}:delete`);
      socket.off(`chat:${user._id}:alerts`);
    };
  }, [
    socketRef,
    user._id,
    count,
    activeId,
    isTemp,
    isOpen,
    setChats,
    updateChats,
    setActiveChat,
    setMsgs,
    setAlerts,
    clearAlerts,
  ]);
};
