import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from './useFetch';
import useSocket from './useSocket';
import useDebounce from './useDebounce';
import useDepedencyTracker from './useDepedencyTracker';
import { FetchError } from '@/util/fetchData';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import Logger from '@/models/Logger';

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
  const {      reqHandler: reqChat      } = useFetch<Chat>();
  const [isActive,           setIsActive] = useState<Chat | null>(null);
  const [msgState,               setMsgs] = useState<Record<string, Msg[]>>({});
  const [alerts,               setAlerts] = useState(0);
  const { deferring,            deferFn } = useDebounce();
  const {            userId             } = useParams();
  const { _id: activeId, isTemp = false } = isActive ?? {};
  const              config               = isMenu ? 'menu' : 'chat';
  const             isInitial             = useRef(true);
  const             socketRef             = useSocket(config);
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

  useDepedencyTracker(config, {
       config,
    socketRef,
      reqUser: user._id,
       userId,
        count,
     activeId,
       isTemp,
       isMenu,
         show,
  });

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const getActiveChat = async () => {
      if (userId && !isMenu) {
        await reqChat(
          { url: `chat/find/${userId}` },
          { onSuccess: (chat) => setIsActive(chat) }
        );
      }
    };

    const initData = async () => {
      if (isInitial.current) {
        await Promise.all([reqChats({ url: 'chat/all' }), getActiveChat()]);
        isInitial.current = false;
      }
    };

    initData();
    setAlerts(count);

    const logger = new Logger(config);
    socket.on('connect', () => logger.connect());

    socket.on(`chat:${user._id}:update`, async ({ chat, isNew, msg }) => {
      logger.event(`update, ChatIsNew? ${isNew}`, chat);

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
      logger.event('delete', deleted);
      const isDeleted = (id?: string) => deleted.some((chat) => chat._id === id);
      if (isDeleted(activeId)) setIsActive(null);
      setChats((prevChats) => prevChats.filter((chat) => !isDeleted(chat._id)));
      setMsgs((state) => { // remove prev fetched client msgs when chat deleted
        const updated = deleted.reduce((acc, { _id }) => ({ ...acc, [_id]: [] }), {});
        return { ...state, ...updated };
      });
    });

    socket.on(`chat:${user._id}:alerts`, (chat) => {
      logger.event('alerts', chat);
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
    config,
    socketRef,
    user._id,
    userId,
    count,
    activeId,
    isTemp,
    isMenu,
    show,
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
    isInitial: isInitial.current,
    deferring,
    deferFn,
    expand,
    collapse,
  };
}
