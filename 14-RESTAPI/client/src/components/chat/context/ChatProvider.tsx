import { useState, ReactNode, useCallback, useEffect, useRef } from "react";
import { ChatContext, StatusMap, MsgsMap } from "./ChatContext";
import { useSearchParams } from "react-router-dom";
import useFetch from "@/lib/hooks/useFetch";
import useSocket from "@/lib/hooks/useSocket";
import useDebounce from "@/lib/hooks/useDebounce";
import useDepedencyTracker from "@/lib/hooks/useDepedencyTracker";
import User from "@/models/User";
import Chat from "@/models/Chat";
import Logger from "@/models/Logger";
import { Auth } from "@/pages/RootLayout";

interface ChatProviderProps {
      user: User;
   setUser: Auth["setUser"];
  children: ReactNode;
}

const config = "chat"; // config logger, sockets and depedencyTracker

export function ChatProvider({ user, setUser, children }: ChatProviderProps) {
  const { data: chats, setData: setChats, reqHandler: reqChats, error } = useFetch<Chat[]>([]);
  const {   reqHandler: reqChat   } = useFetch<Chat>();
  const [isOpen,         setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [msgsMap,          setMsgs] = useState<MsgsMap>({});
  const [alerts,         setAlerts] = useState(0);
  const { deferring,      deferFn } = useDebounce();
  // working here
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("chat");
  const { _id: activeId, isTemp = false } = activeChat ?? {};
  const isInitial = useRef(true);
  const loadedMap = useRef<StatusMap>({});
  const socketRef = useSocket(config);
  const count = chats.reduce((total, { alerts }) => (total += alerts[user._id] || 0), 0);
  // DELETION STATES
  const [isMarking, setIsMarking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [markedMap,    setMarked] = useState<StatusMap>({});
  const wasMarked = Object.keys(markedMap).some((key) => markedMap[key]);
  const closeModal = () => setShowModal(false);
  // END

  const updateChats = useCallback(
    (chat: Chat) => {
      setChats((prevChats) =>
        prevChats.map((prev) => (prev._id === chat._id ? chat : prev))
      );
    },
    [setChats]
  );

  const clearAlerts = useCallback(
    async (id: string) => {
      await reqChat({ url: `alerts/chat/${id}` });
    },
    [reqChat]
  );

  useDepedencyTracker(config, {
    config,
    socketRef,
    reqUser: user._id,
    userId,
    count,
    activeId,
    isTemp,
    isOpen,
  });

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // const getActiveChat = async () => {
    //   if (userId) {
    //     await reqChat(
    //       { url: `chat/find/${userId}` },
    //       { onSuccess: (chat) => setActiveChat(chat) }
    //     );
    //   }
    // };
    if (userId) console.log(userId);

    const initData = async () => {
      if (!isInitial.current) return;
      isInitial.current = false;
      reqChats({ url: "chat/all" });
      // await Promise.all([reqChats({ url: "chat/all" }), getActiveChat()]);
    };

    initData();
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
    userId,
    count,
    activeId,
    isTemp,
    isOpen,
    reqChat,
    reqChats,
    setChats,
    updateChats,
    clearAlerts,
  ]);

  const getRecipient = ({ host, guest }: Chat) => (user._id === host._id ? guest : host);

  const appendURL = (path: string) =>
    setSearchParams((prev) => {
      prev.set("chat", path);
      return prev;
    });

  const destroyURL = () =>
    setSearchParams((prev) => {
      prev.delete("chat");
      return prev;
    });

  const openMenu = async () => {
    deferFn(async () => {
      if (activeChat) appendURL(getRecipient(activeChat)._id);
      setIsOpen(true);
    }, 1500);
  };

  const closeMenu = async () => {
    setIsOpen(false);
    cancelAction();
    destroyURL();
  }

  function expand(chat: Chat, path: string) {
    if (activeChat) return;
    deferFn(() => {
      setActiveChat(chat);
      appendURL(path);
    }, 2500);
  }

  function collapse() {
    destroyURL();
    setActiveChat(null);
  }

  // DELETION FUNCTIONS
  function expandOrMark(chat: Chat, path: string) {
    if (isMarking) {
      setMarked((state) => ({ ...state, [chat._id]: !state[chat._id] }));
    } else {
      expand(chat, path);
    }
  }

  function confirmAction() {
    if ((isMarking && wasMarked) || activeChat) {
      setShowModal(true);
    } else {
      setIsMarking(true);
    }
  }

  function cancelAction() {
    setIsMarking(false);
    setMarked({});
  }

  async function deleteAction() {
    if (!(isMarking || activeChat)) return;

    let data;
    if (wasMarked) {
      data = Object.fromEntries(Object.entries(markedMap).filter(([_, v]) => v));
    } else if (activeChat) {
      data = { [activeChat._id]: true };
    }

    if (!data) return;

    await reqChat({ url: "chat/delete", method: "DELETE", data });
    if (wasMarked) setMarked({});
    closeModal();
    setIsMarking(false);
  }
  // END

  const ctxValue = {
    user,
    setUser,
    alerts,
    clearAlerts,
    chats,
    error,
    msgsMap,
    loadedMap,
    setMsgs,
    activeChat,
    isInitial: isInitial.current,
    deferring,
    isOpen,
    openMenu,
    closeMenu,
    expand,
    collapse,
    isMarking,
    markedMap,
    expandOrMark,
    confirmAction,
    cancelAction,
    deleteAction,
    showModal,
    closeModal,
  };

  return <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>;
}
