import { useEffect } from 'react';
import useFetch from '@/hooks/useFetch';
import { Authorized } from './RootLayout';
import Chat from '@/models/Chat';
import AsyncAwait from '@/components/panel/AsyncAwait';
import ChatList from '@/components/chat/ChatList';
import { captainsLog } from '@/util/captainsLog';

export default function ChatPage({ user }: Authorized) {
  const {
          data: chats,
       setData: setChats,
    reqHandler,
     isLoading,
         error,
  } = useFetch<Chat[]>([]);

  useEffect(() => {
    const mountData = async () => await reqHandler({ url: 'chat/all' });
    mountData();
    captainsLog([-100, 290], ['🗨️ CHAT PAGE']);
  }, [reqHandler]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      <ChatList {...{ user, chats }} />
    </AsyncAwait>
  );
}
