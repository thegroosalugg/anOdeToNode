import { useState, ReactNode, useRef } from "react";
import { ChatContext, StatusMap } from "./ChatContext";
import { useSearchParams } from "react-router-dom";
import useFetch from "@/lib/hooks/useFetch";
import useDebounce from "@/lib/hooks/useDebounce";
import useDepedencyTracker from "@/lib/hooks/useDepedencyTracker";
import User from "@/models/User";
import Chat from "@/models/Chat";
import { Auth } from "@/pages/RootLayout";
import { useChatSocket } from "./useChatSocket";

interface ChatProviderProps {
      user: User;
   setUser: Auth["setUser"];
  children: ReactNode;
}

const config = "chat"; // config logger, sockets and depedencyTracker

export function ChatProvider({ user, setUser, children }: ChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false); // main menu
  const {
    alerts,
    clearAlerts,
    error,
    isLoading,
    chats,
    activeChat,
    setActiveChat,
    msgsMap,
    setMsgs,
  } = useChatSocket({ user, isOpen });
  const { reqHandler: reqChat } = useFetch<Chat>();
  const { deferring,      deferFn } = useDebounce();
  // working here
  const [searchParams, setSearchParams] = useSearchParams();
  const peerId = searchParams.get("chat");
  const loadedMap = useRef<StatusMap>({});
  // DELETION STATES
  const [isMarking, setIsMarking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [markedMap,    setMarked] = useState<StatusMap>({});
  const wasMarked = Object.keys(markedMap).some((key) => markedMap[key]);
  const closeModal = () => setShowModal(false);
  // END

  useDepedencyTracker(config, {
    config,
    reqUser: user._id,
    isOpen,
  });

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
    isLoading,
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
