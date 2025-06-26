import { useState } from 'react';
import useChatListener from '@/lib/hooks/useChatListener';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import ChatList from '../list/ChatList';
import NavButton from '@/components/layout/header/NavButton';
import Counter from '@/components/notifications/Counter';
import SideBar from '@/components/ui/menu/SideBar';

export default function ChatMenu({ user, setUser }: { user: User, setUser: Auth['setUser'] }) {
  const [menu, showMenu] = useState(false);
  const    chatProps     = useChatListener(user, { isMenu: true, show: menu });
  const { alerts, deferring, deferFn } = chatProps;

  const openMenu = async () => {
    deferFn(async () => showMenu(true), 1500);
  };

  return (
    <>
      <SideBar open={menu} close={() => showMenu(false)}>
        <ChatList {...{ ...chatProps, user, setUser }} />
      </SideBar>
      <NavButton {...{ index: 3, deferring, callback: openMenu }}>
        <Counter count={alerts} />
      </NavButton>
    </>
  );
}
