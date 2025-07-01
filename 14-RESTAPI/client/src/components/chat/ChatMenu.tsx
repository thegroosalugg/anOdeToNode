import ChatBody from './layout/ChatBody';
import IconButton from '@/components/ui/button/IconButton';
import Counter from '@/components/ui/counter/Counter';
import SideBar from '@/components/ui/menu/SideBar';
import { useChat } from './context/ChatContext';
import { useChatSocket } from './context/useChatSocket';
import { useChatParamsSync } from './context/useChatParamsSync';

export default function ChatMenu() {
  useChatParamsSync(); // alters context values
  useChatSocket();
  const { alerts, deferring, isOpen, openMenu, closeMenu } = useChat();

  return (
    <>
      <SideBar onRight open={isOpen} close={closeMenu}>
        <ChatBody />
      </SideBar>
      <IconButton icon="comments" onClick={openMenu} {...{ deferring }}>
        <Counter count={alerts} />
        Chat
      </IconButton>
    </>
  );
}
