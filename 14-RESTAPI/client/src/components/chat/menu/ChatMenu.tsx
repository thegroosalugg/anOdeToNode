import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import NavButton from '@/components/navigation/NavButton';
import User from '@/models/User';
import css from './ChatMenu.module.css';

export default function ChatMenu({ user }: { user: User }) {
  const [menu, showMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const animation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
       exit: { opacity: 0 },
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, []);

  const closeMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      showMenu(false);
    }
  };

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {menu && (
            <motion.section className={css['chat-menu']} {...animation} ref={menuRef}></motion.section>
          )}
        </AnimatePresence>,
        document.getElementById('modal-root')!
      )}
      <NavButton {...{ index: 3, deferring: false, callback: () => showMenu(true) }} />
    </>
  );
}
