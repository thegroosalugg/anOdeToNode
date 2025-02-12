import { Authorized } from './RootLayout';
import ChatList from '@/components/chat/ChatList';

export default function ChatPage({ user, setUser }: Authorized) {
  return <ChatList {...{ user, setUser }} />
}
