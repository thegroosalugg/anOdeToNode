import { useCallback, useEffect } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import { useChat } from "./ChatContext";
import Chat from "@/models/Chat";
import Logger from "@/models/Logger";
import { RecordMap } from "@/lib/types/common";

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
    setLoaded,
    setMsgs,
    setAlerts,
    clearAlerts,
    appendURL,
  } = useChat();

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

    const updateChannel = `chat:${user._id}:update`;
    const deleteChannel = `chat:${user._id}:delete`;
    const  alertChannel = `chat:${user._id}:alerts`;

    socket.on(updateChannel, async ({ chat, isNew, msg }) => {
      logger.event(`update, ChatIsNew? ${isNew}`, chat);

      const  isSender = user._id === msg.sender;
      const isVisible = chat._id === activeId && isOpen;

      if (isNew) {
        setChats((prevChats) => [chat, ...prevChats]);
        setActiveChat((prev) => {
          // store real chatID only inside temp chat for possible deletion
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

    socket.on(deleteChannel, (deletedChats: Chat[]) => {
      logger.event("delete", deletedChats);
      const isDeleted = (id?: string) => deletedChats.some((chat) => chat._id === id);

      // if dummy chat, use the stored real chatId, else active chat is real
      if (isDeleted(isTemp ? chatId : activeId)) collapse();
      // else must trigger the same change collapse() triggers to wake useChatParamsSync Effect
      else appendURL("deleted"); // dummy event retriggers effect either if or else

      setChats((prevChats) => prevChats.filter((chat) => !isDeleted(chat._id)));

      const cleanState = <T extends RecordMap<unknown>>(state: T) => {
        const updated = { ...state };
        deletedChats.forEach(({ _id }) => {
          delete updated[_id];
        });
        return updated;
      };

      setLoaded((state) => cleanState(state));
        setMsgs((state) => cleanState(state));
    });

    socket.on(alertChannel, (chat) => {
      logger.event("alerts", chat);
      // prevents socket updates from replacing temp chat => no component dismount
      if (chat._id === activeId) setActiveChat(chat);
      updateChats(chat);
    });

    return () => {
      socket.off("connect");
      socket.off(updateChannel);
      socket.off(deleteChannel);
      socket.off(alertChannel);
    };
  }, [
    socketRef,
    user._id,
    count,
    activeId, // either from saved or dummy chat
    chatId, // saved chat ID stored in dummy chat
    isTemp, // dummy chat flag
    isOpen,
    setLoaded,
    setChats,
    updateChats,
    setActiveChat,
    collapse,
    setMsgs,
    setAlerts,
    clearAlerts,
    appendURL,
  ]);
};
