import useChatListener from '@/hooks/useChatListener';
import { Authorized } from './RootLayout';
import ChatList from '@/components/chat/ChatList';

export default function ChatPage({ user, setUser }: Authorized) {
  const chatProps = useChatListener(user);

  return <ChatList {...{ ...chatProps, user, setUser }} />
}
