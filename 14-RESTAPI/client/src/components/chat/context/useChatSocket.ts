import { useCallback, useEffect } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import { useChat } from "./ChatContext";
import Chat from "@/models/Chat";
import Logger from "@/models/Logger";
import { useSearchParams } from "react-router-dom";

const config = "chat"; // logger/sockets

export const useChatSocket = () => {
  const {
    user,
    isOpen,
    chats,
    setChats,
    activeChat,
    setActiveChat,
    collapse,
    loadedMap,
    setMsgs,
    setAlerts,
    clearAlerts,
  } = useChat();
  const [_, setSearchParams] = useSearchParams();

  const socketRef = useSocket(config);

  const { _id: activeId, isTemp = false, chatId } = activeChat ?? {};
  const count = chats.reduce((total, { alerts }) => (total += alerts[user._id] || 0), 0);

  const updateChats = useCallback(
    (chat: Chat) =>
      setChats((prevChats) =>
        prevChats.map((prev) => (prev._id === chat._id ? chat : prev))
      ),
    [setChats]
  );

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
        // store real chatID only inside temp chat for possible deletion
        setActiveChat((prev) => {
          if (prev?.isTemp) return { ...prev, chatId: chat._id };
          return prev; // do not overwrite temp chat with real => will cause component dismount
        });
      } else if ((isVisible || isTemp) && !isSender) {
        await clearAlerts(chat._id); // states updated by alerts socket
      } else {
        updateChats(chat);
      }

      setMsgs((state) => {
        // if still in temp chat, store messages there until its destroyed
        const _id = isTemp ? activeId : chat._id;
        return { ...state, [_id]: [...(state[_id] || []), msg] };
      });
    });

    socket.on(`chat:${user._id}:delete`, (deleted: Chat[]) => {
      logger.event("delete", deleted);
      const isDeleted = (id?: string) => deleted.some((chat) => chat._id === id);
      // if dummy chat, use the stored real chatId, else active chat is real
      if (isDeleted(isTemp ? chatId : activeId)) {
        collapse();
      } else {
        // else must trigger the same params change collapse() triggers to wake useChatParamsSync Effect
        setSearchParams((prev) => {
          prev.set("chat", "deleted"); // dummy event retriggers effect either if or else
          return prev;
        });
      }

      deleted.forEach(({ _id }) => {
        delete loadedMap.current[_id]; // force future re-fetch
      });
      setChats((prevChats) => prevChats.filter((chat) => !isDeleted(chat._id)));
      setMsgs((state) => {
        // remove prev fetched client msgs when chat deleted
        const updated = deleted.reduce((acc, { _id }) => ({ ...acc, [_id]: [] }), {});
        return { ...state, ...updated };
      });
    });

    socket.on(`chat:${user._id}:alerts`, (chat) => {
      logger.event("alerts", chat);
      // NOT SURE if I need this line anymore - to review
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
    activeId, // either from saved or dummy chat
    chatId, // saved chat ID stored in dummy chat
    isTemp, // dummy chat flag
    isOpen,
    loadedMap,
    setChats,
    updateChats,
    setActiveChat,
    collapse,
    setMsgs,
    setAlerts,
    clearAlerts,
    setSearchParams,
  ]);
};
