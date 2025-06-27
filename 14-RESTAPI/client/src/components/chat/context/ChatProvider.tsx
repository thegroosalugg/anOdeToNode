import { useState, ReactNode, useCallback, useEffect, useRef } from "react";
import { ChatContext, StatusMap, MsgsMap } from "./ChatContext";
import { useParams } from "react-router-dom";
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

export function ChatProvider({ user, setUser, children }: ChatProviderProps) {
  const {
          data: chats,
       setData: setChats,
    reqHandler: reqChats,
    error,
  } = useFetch<Chat[]>([]);
  const { reqHandler: reqChat, error: findChatErr } = useFetch<Chat>();
  const [isOpen,     setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState<Chat | null>(null);
  const [msgsMap,      setMsgs] = useState<MsgsMap>({});
  const [alerts,     setAlerts] = useState(0);
  const { deferring,  deferFn } = useDebounce();
  const { userId } = useParams();
  const { _id: activeId, isTemp = false } = isActive ?? {};
  const isInitial = useRef(true);
  const loadedMap = useRef<StatusMap>({});
  const config = "chat";
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

    const getActiveChat = async () => {
      if (userId) {
        await reqChat(
          { url: `chat/find/${userId}` },
          { onSuccess: (chat) => setIsActive(chat) }
        );
      }
    };

    const initData = async () => {
      if (isInitial.current) {
        isInitial.current = false;
        await Promise.all([reqChats({ url: "chat/all" }), getActiveChat()]);
      }
    };

    initData();
    setAlerts(count);

    const logger = new Logger(config);
    socket.on("connect", () => logger.connect());

    socket.on(`chat:${user._id}:update`, async ({ chat, isNew, msg }) => {
      logger.event(`update, ChatIsNew? ${isNew}`, chat);

      const isSender = user._id === msg.sender;
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
      if (isDeleted(activeId)) setIsActive(null);
      setChats((prevChats) => prevChats.filter((chat) => !isDeleted(chat._id)));
      setMsgs((state) => {
        // remove prev fetched client msgs when chat deleted
        const updated = deleted.reduce((acc, { _id }) => ({ ...acc, [_id]: [] }), {});
        return { ...state, ...updated };
      });
    });

    socket.on(`chat:${user._id}:alerts`, (chat) => {
      logger.event("alerts", chat);
      if (chat._id === activeId) setIsActive(chat);
      updateChats(chat);
    });

    return () => {
      socket.off("connect");
      socket.off(`chat:${user._id}:update`);
      socket.off(`chat:${user._id}:delete`);
      socket.off(`chat:${user._id}:alerts`);
    };
  }, [
    config,
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

  const openMenu = async () => {
    deferFn(async () => setIsOpen(true), 1500);
  };

  const closeMenu = async () => {
    setIsOpen(false);
    cancelAction();
  }

  function expand(chat: Chat, path: string) {
    if (!isActive)
      deferFn(() => {
        setIsActive(chat);
        window.history.replaceState(null, "", `?chat=${path}`);
      }, 2500);
  }

  function collapse() {
    const url = new URL(window.location.href);
    url.searchParams.delete("chat");
    window.history.replaceState(null, "", url.toString());
    setIsActive(null);
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
    if ((isMarking && wasMarked) || isActive) {
      setShowModal(true);
    } else {
      setIsMarking(true);
    }
  }

  async function deleteAction() {
    if (!(isMarking || isActive)) return;

    let data;
    if (wasMarked) {
      data = Object.fromEntries(Object.entries(markedMap).filter(([_, v]) => v));
    } else if (isActive) {
      data = { [isActive._id]: true };
    }

    if (!data) return;

    await reqChat({ url: "chat/delete", method: "DELETE", data });
    if (wasMarked) setMarked({});
    closeModal();
    setIsMarking(false);
  }

  function cancelAction() {
    setIsMarking(false);
    setMarked({});
  }
  // END

  const ctxValue = {
    user,
    setUser,
    alerts,
    clearAlerts,
    chats,
    error: error || findChatErr, // findChatErr is mostly null. Only on initial find chat render
    msgsMap,
    loadedMap,
    setMsgs,
    isActive,
    isInitial: isInitial.current,
    deferring,
    deferFn,
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
