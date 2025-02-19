import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from './useFetch';
import useInitial from './useInitial';
import useDebounce from './useDebounce';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import User from '@/models/User';
import Chat from '@/models/Chat';
import { captainsLog } from '@/util/captainsLog';

export default function useChatListener(user: User, isMenu: boolean = false) {
  const {
          data: chats,
       setData: setChats,
    reqHandler: reqChats,
         error,
  } = useFetch<Chat[]>([]);
  const { reqHandler: reqActiveChat } = useFetch<Chat>();
  const [isActive,       setIsActive] = useState<[Chat] | null>(null);
  const [alerts,           setAlerts] = useState(0);
  const { deferring,        deferFn } = useDebounce();
  const { isInitial,      mountData } = useInitial();
  const {          userId           } = useParams();
  const          activeId             = isActive?.[0]._id;
  const count = chats.reduce((total, { alerts }) => (total += alerts[user._id] || 0), 0);

  useEffect(() => {
    const getActiveChat = async () => {
      if (userId && !isMenu) {
        await reqActiveChat(
          { url: `chat/find/${userId}` },
          { onSuccess: (chat) => setIsActive([chat]) }
        );
      }
    };

    const initData = async () =>
      mountData(
        async () => await Promise.all([reqChats({ url: 'chat/all' }), getActiveChat()]),
        5
      );

    initData();
    setAlerts(count);

    const socket = io(BASE_URL);

    socket.on('connect', () => captainsLog([-100, 290], ['CHAT 💬: Socket connected']));

    socket.on(`chat:${user._id}:update`, ({ chat, isNew }) => {
      captainsLog([-100, 285], [`CHAT 💬: Update, isNew ${isNew}`, chat]);
      if (chat._id === activeId) setIsActive([chat]);

      setChats((prevChats) => {
        if (isNew) return [chat, ...prevChats];
        else       return prevChats.map((prev) => (prev._id === chat._id ? chat : prev));
      });
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

      setChats((prevChats) =>
        prevChats.map((prev) => (prev._id === chat._id ? chat : prev))
      );
    });

    return () => {
      socket.off('connect');
      socket.off(`chat:${user._id}:update`);
      socket.off(`chat:${user._id}:delete`);
      socket.off(`chat:${user._id}:alerts`);
      socket.disconnect();
      captainsLog([-100, 290], ['CHAT 💬 disconnect']); // **LOGDATA
    };
  }, [
         user._id,
           userId,
            count,
         activeId,
           isMenu,
        mountData,
    reqActiveChat,
         reqChats,
         setChats,
  ]);

  function expand(chat: Chat) {
    if (!isActive) deferFn(() => setIsActive([chat]), 2500);
  }

  function collapse() {
    setIsActive(null);
  }

  return {
       alerts,
        chats,
     setChats,
        error,
     isActive,
    isInitial,
    deferring,
      deferFn,
       expand,
     collapse,
  };
}
