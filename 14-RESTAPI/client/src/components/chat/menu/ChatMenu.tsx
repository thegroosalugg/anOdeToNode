import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import Chat from '@/models/Chat';
import PortalMenu from '@/components/panel/PortalMenu';
import AsyncAwait from '@/components/panel/AsyncAwait';
import ChatList from '../ChatList';
import NavButton from '@/components/navigation/NavButton';
import Counter from '@/components/notifications/Counter';
import { captainsLog } from '@/util/captainsLog';
import css from './ChatMenu.module.css';

export default function ChatMenu({ user }: { user: User }) {
  const { data: chats, setData: setChats, reqHandler, error } = useFetch<Chat[]>([]);
  const [menu, showMenu] = useState(false);
  const { deferring, deferFn } = useDebounce();
  const isInitial = useRef(true);
  const navigate = useNavigate();

  const openMenu = async () => {
    isInitial.current = true;
    deferFn(async () => {
      showMenu(true);
      await reqHandler({ url: 'chat/all' });
      isInitial.current = false;
    }, 1500);
  };

  const navTo = () => {
    showMenu(false);
    navigate('/inbox');
  };

  useEffect(() => {
    captainsLog([-100, 320], ['CHAT MENU 💬']);
  }, [reqHandler]);

  return (
    <>
      <PortalMenu show={menu} close={() => showMenu(false)}>
        <h2 className={css['header']} onClick={navTo}>
          Go to Inbox
          <FontAwesomeIcon icon='envelope-open-text' />
        </h2>
        <AsyncAwait {...{ isLoading: isInitial.current, error }}>
          <ChatList {...{ user, chats }} />
        </AsyncAwait>
      </PortalMenu>
      <NavButton {...{ index: 3, deferring, callback: openMenu }}>
        <Counter count={1} />
      </NavButton>
    </>
  );
}
