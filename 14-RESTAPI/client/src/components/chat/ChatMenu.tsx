import ChatBody from './layout/ChatBody';
import NavButton from '@/components/layout/header/NavButton';
import Counter from '@/components/notifications/Counter';
import SideBar from '@/components/ui/menu/SideBar';
import { useChat } from './context/ChatContext';

export default function ChatMenu() {
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
