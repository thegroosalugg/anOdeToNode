import ChatList from '../list/ChatList';
import NavButton from '@/components/layout/header/NavButton';
import Counter from '@/components/notifications/Counter';
import SideBar from '@/components/ui/menu/SideBar';
import { useChat } from '../context/ChatContext';

export default function ChatMenu() {
  const { alerts, deferring, isOpen, openMenu, closeMenu } = useChat();
  return (
    <>
      <SideBar {...{ isOpen }} close={closeMenu}>
        <ChatList />
      </SideBar>
      <NavButton {...{ index: 3, deferring, callback: openMenu }}>
        <Counter count={alerts} />
      </NavButton>
    </>
  );
}
