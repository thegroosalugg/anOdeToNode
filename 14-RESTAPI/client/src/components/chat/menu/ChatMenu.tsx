// import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import User from '@/models/User';
import PortalMenu from '@/components/panel/PortalMenu';
import NavButton from '@/components/navigation/NavButton';
import css from './ChatMenu.module.css';

export default function ChatMenu({ user }: { user: User }) {
  const [menu, showMenu] = useState(false);

  useEffect(() => {

    return () => {
    };
  }, []);

  return (
    <>
      <PortalMenu show={menu} close={() => showMenu(false)}>
        Chats
      </PortalMenu>
      <NavButton {...{ index: 3, deferring: false, callback: () => showMenu(true) }} />
    </>
  );
}
