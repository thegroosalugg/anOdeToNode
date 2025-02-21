import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatListener from '@/hooks/useChatListener';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import PortalMenu from '@/components/panel/PortalMenu';
import ChatList from './ChatList';
import NavButton from '@/components/navigation/NavButton';
import Counter from '@/components/notifications/Counter';
import css from './ChatMenu.module.css';

export default function ChatMenu({ user, setUser }: { user: User, setUser: Auth['setUser'] }) {
  const [menu, showMenu] = useState(false);
  const     navigate     = useNavigate();
  const    chatProps     = useChatListener(user, true);
  const { alerts, deferring, deferFn } = chatProps;

  const openMenu = async () => {
    deferFn(async () => showMenu(true), 1500);
  };

  const navTo = () => {
    showMenu(false);
    navigate('/inbox');
  };

  return (
    <>
      <PortalMenu show={menu} close={() => showMenu(false)}>
        <h2 className={css['header']} onClick={navTo}>
          Go to Inbox
          <FontAwesomeIcon icon='envelope-open-text' />
        </h2>
        <ChatList {...{ ...chatProps, user, setUser }} />
      </PortalMenu>
      <NavButton {...{ index: 3, deferring, callback: openMenu }}>
        <Counter count={alerts} />
      </NavButton>
    </>
  );
}
