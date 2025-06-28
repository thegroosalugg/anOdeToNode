import ChatBody from './layout/ChatBody';
import NavButton from '@/components/layout/header/NavButton';
import Counter from '@/components/notifications/Counter';
import SideBar from '@/components/ui/menu/SideBar';
import { useChat } from './context/ChatContext';
import { useChatSocket } from './context/useChatSocket';
import { useChatParamsSync } from './context/useChatParamsSync';

export default function ChatMenu() {
  useChatSocket(); // alters context values
  useChatParamsSync();
  const { alerts, deferring, isOpen, openMenu, closeMenu } = useChat();

  return (
    <>
      <SideBar {...{ isOpen }} close={closeMenu}>
        <ChatBody />
      </SideBar>
      <NavButton {...{ index: 3, deferring, callback: openMenu }}>
        <Counter count={alerts} />
      </NavButton>
    </>
  );
}
