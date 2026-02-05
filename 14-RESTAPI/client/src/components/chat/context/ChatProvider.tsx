import { useState, ReactNode, useCallback } from "react";
import { ChatContext, MsgsMap, StatusMap } from "./ChatContext";
import { useSearchParams } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import { UserState } from "@/lib/types/auth";
import Chat from "@/models/Chat";

interface ChatProvider extends UserState {
  children: ReactNode;
}

export function ChatProvider({ user, setUser, children }: ChatProvider) {
  const {
         data: chats,
      setData: setChats,
      reqData: reqChats,
    isLoading,
        error,
  } = useFetch<Chat[]>([]);
  const { reqData } = useFetch<Chat>();
  const [isOpen,         setIsOpen] = useState(false); // main menu
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [msgsMap,          setMsgs] = useState<MsgsMap>({});
  const [loadedMap,      setLoaded] = useState<StatusMap>({});
  const [alerts,         setAlerts] = useState(0);
  const [isMarking,   setIsMarking] = useState(false);
  const [markedMap,      setMarked] = useState<StatusMap>({});
  const [showModal,   setShowModal] = useState(false);
  const [,         setSearchParams] = useSearchParams();
  const { deferring,      deferFn } = useDebounce();

  const wasMarked = Object.keys(markedMap).some((key) => markedMap[key]);

  const activeId = activeChat?._id + "";
  useDepedencyTracker("chat", {
    currentChat: activeId,
         istemp: activeChat?.isTemp,
    savedChatId: activeChat?.chatId,
         alerts,
      hasLoaded: loadedMap[activeId],
       noOfMsgs:   msgsMap[activeId]?.length,
    markedChats: markedMap[activeId],
  });

  const getRecipient = ({ host, guest }: Chat) => (user._id === host._id ? guest : host);

  const clearAlerts = useCallback(
    async (id: string) => {
      await reqData({ url: `alerts/chat/${id}` });
    },
    [reqData]
  );

  const appendURL = useCallback(
    (path: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev.toString());
        next.set("chat", path);
        return next;
      });
    },
    [setSearchParams]
  );

  const destroyURL = useCallback(
    () =>
      setSearchParams((prev) => {
        prev.delete("chat");
        return prev;
      }),
    [setSearchParams]
  );

  const openMenu = () => {
    setIsOpen(true);
    deferFn(() => {
      if (activeChat) appendURL(getRecipient(activeChat)._id);
    }, 500);
  };

  const closeMenu = () => {
    deferFn(() => {
      destroyURL(); // async URL update
      setIsOpen(false);
      cancelAction();
      if (!activeChat?.isTemp) return;
      if (activeChat.chatId) { // silently replace temp chat with real while out of view
        const chat = chats.find(({ _id }) => _id === activeChat.chatId);
        if (chat) setTimeout(() => setActiveChat(chat), 500);
      } else {
        setActiveChat(null);
      }
    }, 500)
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

    if (activeChat?.isTemp && !activeChat.chatId) {
      closeModal(); // allows UI simulation of deleting dummy unsaved chat
      collapse();
      return;
    }

    let data;
    if (wasMarked) {
      data = Object.fromEntries(Object.entries(markedMap).filter(([, v]) => v));
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
    chats,
    setChats,
    reqChats,
    isLoading,
    error,
    msgsMap,
    setMsgs,
    loadedMap,
    setLoaded,
    isOpen,
    setIsOpen,
    openMenu,
    closeMenu,
    activeChat,
    setActiveChat,
    collapse,
    showModal,
    closeModal,
    isMarking,
    markedMap,
    expandOrMark,
    confirmAction,
    cancelAction,
    deleteAction,
    alerts,
    setAlerts,
    clearAlerts,
    appendURL,
    destroyURL,
    deferring,
  };

  return <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>;
}
