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
   setChats: Dispatch<SetStateAction<Chat[]>>;
   msgState: MsgState;
    setMsgs: Dispatch<SetStateAction<MsgState>>;
      error: FetchError | null;
   isActive: [Chat]     | null;
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
  const [isActive,       setIsActive] = useState<[Chat] | null>(null);
  const [msgState,           setMsgs] = useState<Record<string, Msg[]>>({});
  const [alerts,           setAlerts] = useState(0);
  const { deferring,        deferFn } = useDebounce();
  const { isInitial,      mountData } = useInitial();
  const {          userId           } = useParams();
  const          activeId             = isActive?.[0]._id;
  const            socket             = useSocket('CHAT');
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
          { onSuccess: (chat) => setIsActive([chat]) }
        );
      }
    };

    const initData = async () =>
      mountData(async () => {
        await Promise.all([
          reqChats({ url: 'chat/all' }),
          getActiveChat()
        ]);
      }, 5);

    initData();
    setAlerts(count);

    if (!socket) return;
    socket.on('connect', () => captainsLog([-100, 290], ['CHAT 💬: Socket connected']));

    socket.on(`chat:${user._id}:update`, async ({ chat, isNew, msg }) => {
      captainsLog([-100, 285], [`CHAT 💬: Update, isNew ${isNew}`, chat]);

      const isVisible = chat._id === activeId && (!isMenu || (isMenu && show));
      if (isNew) {
        setChats(prevChats => [chat, ...prevChats]);
      } else if (isVisible) {
        await clearAlerts(chat._id); // states updated by alerts socket
      } else {
        updateChats(chat);
      }

      setMsgs((state) => ({ ...state, [chat._id]: [...(state[chat._id] || []), msg] }));
    });

    socket.on(`chat:${user._id}:delete`, (deleted: Chat[]) => {
      captainsLog([-100, 285], [`CHAT 💬: Deleted`, deleted]);
      const isDeleted = (id?: string) => deleted.some((chat) => chat._id === id);
      if (isDeleted(activeId)) setIsActive(null);
      setChats((prevChats) => prevChats.filter((chat) => !isDeleted(chat._id)));
    });

    socket.on(`chat:${user._id}:alerts`, (chat) => {
      captainsLog([-100, 285], [`CHAT 💬: Alerts`, chat]);
      if (chat._id === activeId) setIsActive([chat]);
      updateChats(chat);
    });

    return () => {
      socket.off('connect');
      socket.off(`chat:${user._id}:update`);
      socket.off(`chat:${user._id}:delete`);
      socket.off(`chat:${user._id}:alerts`);
    };
  }, [
    socket,
    user._id,
    userId,
    count,
    activeId,
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
        setIsActive([chat]);
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
    setChats,
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
