import { useState, ReactNode, useRef, useCallback } from "react";
import { ChatContext, MsgsMap, StatusMap, UserData } from "./ChatContext";
import { useSearchParams } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import Chat from "@/models/Chat";

interface ChatProviderProps extends UserData {
  children: ReactNode;
}

const config = "chat"; // config logger, sockets and depedencyTracker

export function ChatProvider({ user, setUser, children }: ChatProviderProps) {
  const {
         data: chats,
      setData: setChats,
      reqData: reqChats,
    isLoading,
        error,
  } = useFetch<Chat[]>([]);
  const { reqData } = useFetch<Chat>();
  const [isOpen,             setIsOpen] = useState(false); // main menu
  const [activeChat,     setActiveChat] = useState<Chat | null>(null);
  const [msgsMap,              setMsgs] = useState<MsgsMap>({});
  const [alerts,             setAlerts] = useState(0);
  const { deferring,          deferFn } = useDebounce();
  const [_,            setSearchParams] = useSearchParams();
  const [isMarking,       setIsMarking] = useState(false);
  const [markedMap,          setMarked] = useState<StatusMap>({});
  const [showModal,       setShowModal] = useState(false);

  const loadedMap = useRef<StatusMap>({}); // loaded messages per chat
  const wasMarked = Object.keys(markedMap).some((key) => markedMap[key]);

  useDepedencyTracker(config, {
    chatId: activeChat?._id
  });

  const getRecipient = ({ host, guest }: Chat) => (user._id === host._id ? guest : host);

  const clearAlerts = useCallback(
    async (id: string) => {
      await reqData({ url: `alerts/chat/${id}` });
    },
    [reqData]
  );

  const appendURL = (path: string) =>
    setSearchParams((prev) => {
      prev.set("chat", path);
      return prev;
    });

  const destroyURL = useCallback(
    () =>
      setSearchParams((prev) => {
        prev.delete("chat");
        return prev;
      }),
    [setSearchParams]
  );

  const openMenu = async () => {
    deferFn(async () => {
      if (activeChat) appendURL(getRecipient(activeChat)._id);
      setIsOpen(true);
    }, 1500);
  };

  const closeMenu = async () => {
    destroyURL(); // async URL update
    setIsOpen(false);
    cancelAction();
    if (activeChat?.isTemp) setActiveChat(null);
  };

  const expand = (chat: Chat, path: string) => {
    if (activeChat) return;
    deferFn(() => {
      setActiveChat(chat);
      appendURL(path);
    }, 2500);
  }

  const collapse = useCallback(() => {
    destroyURL();
    setActiveChat(null);
  }, [destroyURL])

  const closeModal = () => setShowModal(false);

  const expandOrMark = (chat: Chat, path: string) => {
    if (isMarking) {
      setMarked((state) => ({ ...state, [chat._id]: !state[chat._id] }));
    } else {
      expand(chat, path);
    }
  }

  const confirmAction = () => {
    if ((isMarking && wasMarked) || activeChat) {
      setShowModal(true);
    } else {
      setIsMarking(true);
    }
  }

  const cancelAction = () => {
    setIsMarking(false);
    setMarked({});
  }

  async function deleteAction() {
    if (!(isMarking || activeChat)) return;

    let data;
    if (wasMarked) {
      data = Object.fromEntries(Object.entries(markedMap).filter(([_, v]) => v));
    } else if (activeChat) {
      // if temp chat, it will have stored the newly created real chat's ID
      const _id = activeChat.isTemp ? activeChat.chatId : activeChat._id;
      if (_id) data = { [_id]: true };
    }

    if (!data) return;

    await reqData({ url: "chat/delete", method: "DELETE", data });
    if (wasMarked) setMarked({});
    closeModal();
    setIsMarking(false);
  }

  const ctxValue = {
    user,
    setUser,
    alerts,
    setAlerts,
    clearAlerts,
    chats,
    setChats,
    reqChats,
    error,
    msgsMap,
    loadedMap,
    setMsgs,
    activeChat,
    setActiveChat,
    isLoading,
    deferring,
    isOpen,
    setIsOpen,
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
