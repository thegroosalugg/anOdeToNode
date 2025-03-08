import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from './useFetch';
import useSocket from './useSocket';
import useInitial from './useInitial';
import useDebounce from './useDebounce';
import { FetchError } from '@/util/fetchData';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import { captainsLog } from '@/util/captainsLog';

type MsgState = Record<string, Msg[]>;

export type ChatListener = {
      chats: Chat[];
   msgState: MsgState;
    setMsgs: Dispatch<SetStateAction<MsgState>>;
      error: FetchError | null;
   isActive: Chat       | null;
  isInitial: boolean;
  deferring: boolean;
clearAlerts: (id: string) => Promise<void>;
     expand: (chat: Chat, path: string) => void;
   collapse: () => void;
    isMenu?: boolean;
};

export default function useChatListener(
  user: User,
  { isMenu, show }: { isMenu?: boolean; show?: boolean } = {}
) {
  const {
          data: chats,
       setData: setChats,
    reqHandler: reqChats,
         error,
  } = useFetch<Chat[]>([]);
  const { reqHandler:       reqChat } = useFetch<Chat>();
  const [isActive,       setIsActive] = useState<Chat | null>(null);
  const [msgState,           setMsgs] = useState<Record<string, Msg[]>>({});
  const [alerts,           setAlerts] = useState(0);
  const { deferring,        deferFn } = useDebounce();
  const { isInitial,      mountData } = useInitial();
  const {          userId           } = useParams();
  const { _id: activeId,     isTemp } = isActive ?? {};
  const         socketRef             = useSocket('CHAT');
  const count = chats.reduce((total, { alerts }) => (total += alerts[user._id] || 0), 0);

  const updateChats = useCallback(
    (chat: Chat) => {
      setChats((prevChats) =>
        prevChats.map((prev) => (prev._id === chat._id ? chat : prev))
      );
    },
    [setChats]
  );

  const clearAlerts = useCallback(async (id: string) => {
    await reqChat({ url: `alerts/chat/${id}` });
  }, [reqChat]);

  useEffect(() => {
    const getActiveChat = async () => {
      if (userId && !isMenu) {
        await reqChat(
          { url: `chat/find/${userId}` },
          { onSuccess: (chat) => setIsActive(chat) }
        );
      }
    };

    const initData = async () =>
      mountData(async () => {
        await Promise.all([reqChats({ url: 'chat/all' }), getActiveChat()]);
      });

    initData();
    setAlerts(count);

    const socket = socketRef.current;
    if (!socket) return;
    const location = isMenu ? 'MENU' : 'PAGE';
    socket.on('connect', () => captainsLog(290, [`CHAT ${location} 💬: Socket connected`]));

    socket.on(`chat:${user._id}:update`, async ({ chat, isNew, msg }) => {
      captainsLog(285, [`CHAT ${location} 💬: Update, isNew ${isNew}`, chat]);

      const isSender  = user._id === msg.sender;
      const isVisible = chat._id === activeId && (!isMenu || (isMenu && show));

      if (isNew) {
        setChats(prevChats => [chat, ...prevChats]);
      } else if ((isVisible || isTemp) && !isSender) {
        await clearAlerts(chat._id); // states updated by alerts socket
      } else {
        updateChats(chat);
      }

      setMsgs((state) => {
        const chatId = isTemp && !isMenu ? activeId : chat._id;
        return { ...state, [chatId]: [...(state[chatId] || []), msg] };
      });
    });

    socket.on(`chat:${user._id}:delete`, (deleted: Chat[]) => {
      captainsLog(285, [`CHAT ${location} 💬: Deleted`, deleted]);
      const isDeleted = (id?: string) => deleted.some((chat) => chat._id === id);
      if (isDeleted(activeId)) setIsActive(null);
      setChats((prevChats) => prevChats.filter((chat) => !isDeleted(chat._id)));
      setMsgs((state) => { // remove prev fetched client msgs when chat deleted
        const updated = deleted.reduce((acc, { _id }) => ({ ...acc, [_id]: [] }), {});
        return { ...state, ...updated };
      });
    });

    socket.on(`chat:${user._id}:alerts`, (chat) => {
      captainsLog(285, [`CHAT ${location} 💬: Alerts`, chat]);
      if (chat._id === activeId) setIsActive(chat);
      updateChats(chat);
    });

    return () => {
      socket.off('connect');
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
    isMenu,
    show,
    mountData,
    reqChat,
    reqChats,
    setChats,
    updateChats,
    clearAlerts,
  ]);

  function expand(chat: Chat, path: string) {
    if (!isActive)
      deferFn(() => {
        setIsActive(chat);
        if (!isMenu) window.history.replaceState(null, '', path);
      }, 2500);
  }

  function collapse() {
    setIsActive(null);
    if (!isMenu) window.history.replaceState(null, '', '/inbox');
  }

  return {
    alerts,
    clearAlerts,
    chats,
    error,
    msgState,
    setMsgs,
    isMenu,
    isActive,
    isInitial,
    deferring,
    deferFn,
    expand,
    collapse,
  };
}
