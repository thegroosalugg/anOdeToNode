import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from './useFetch';
import useSocket from './useSocket';
import useDebounce from './useDebounce';
import useDepedencyTracker from './useDepedencyTracker';
import { FetchError } from '@/lib/util/fetchData';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import Logger from '@/models/Logger';

type  MsgState = Record<string, Msg[]>;
type LoadState = Record<string, boolean>;

export type ChatListener = {
      chats: Chat[];
   msgState: MsgState;
  loadState: MutableRefObject<LoadState>;
    setMsgs: Dispatch<SetStateAction<MsgState>>;
      error: FetchError | null;
   isActive: Chat       | null;
  isInitial: boolean;
  deferring: boolean;
clearAlerts: (id: string) => Promise<void>;
     expand: (chat: Chat, path: string) => void;
   collapse: () => void;
};

export default function useChatListener(
  user: User,
  { isOpen }: { isOpen?: boolean } = {}
) {
  const {
          data: chats,
       setData: setChats,
    reqHandler: reqChats,
         error,
  } = useFetch<Chat[]>([]);
  const {
    reqHandler: reqChat,
         error: findChatErr
  } = useFetch<Chat>();
  const [isActive,           setIsActive] = useState<Chat | null>(null);
  const [msgState,               setMsgs] = useState<MsgState>({});
  const [alerts,               setAlerts] = useState(0);
  const { deferring,            deferFn } = useDebounce();
  const {            userId             } = useParams();
  const { _id: activeId, isTemp = false } = isActive ?? {};
  const             isInitial             = useRef(true);
  const             loadState             = useRef<LoadState>({});
  const              config               = "chat";
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
        await Promise.all([reqChats({ url: 'chat/all' }), getActiveChat()]);
      }
    };

    initData();
    setAlerts(count);

    const logger = new Logger(config);
    socket.on('connect', () => logger.connect());

    socket.on(`chat:${user._id}:update`, async ({ chat, isNew, msg }) => {
      logger.event(`update, ChatIsNew? ${isNew}`, chat);

      const isSender  = user._id === msg.sender;
      const isVisible = chat._id === activeId && isOpen;

      if (isNew) {
        setChats(prevChats => [chat, ...prevChats]);
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
    isOpen,
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
        window.history.replaceState(null, '', `?chat=${path}`);
      }, 2500);
  }

  function collapse() {
    const url = new URL(window.location.href);
    url.searchParams.delete('chat');
    window.history.replaceState(null, '', url.toString());
    setIsActive(null);
  }

  return {
    alerts,
    clearAlerts,
    chats,
    error: error || findChatErr, // findChatErr is mostly null. Only on initial find chat render
    msgState,
    loadState,
    setMsgs,
    isActive,
    isInitial: isInitial.current,
    deferring,
    deferFn,
    expand,
    collapse,
  };
}
