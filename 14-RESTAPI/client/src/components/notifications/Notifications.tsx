import { isMobile } from 'react-device-detect';
import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import { captainsLog } from '@/util/captainsLog';
import nav from '../navigation/NavButton.module.css';
import css from './Notifications.module.css';

export default function Notifications({ user, setUser }: Auth) {
  const [menu, showMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLandscape = window.matchMedia('(orientation: landscape)').matches && isMobile;
  const [x, y] = isLandscape ? [75, 0] : [0, 75];

  const closeMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node))
      showMenu(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog(-100, 15, ['NAV: Socket connected']));

    socket.on(`peer:${user?._id}:update`, (updated) => {
      captainsLog(-100, 15, ['NAV: UPDATE', updated]);
      setUser(updated);
    });

    return () => {
      socket.off('connect');
      socket.off(`peer:${user?._id}:update`);
      socket.disconnect();
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [user?._id, setUser]);

  return (
    <>
      <AnimatePresence>
        {menu && (
          <motion.section
            className={css['notifications']}
                  ref={menuRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
          >
            MENU
          </motion.section>
        )}
      </AnimatePresence>
      <motion.button
        className={nav['nav-button']}
          onClick={() => showMenu(true)}
          initial={{ opacity: 0, y,    x }}
          animate={{ opacity: 1, y: 0, x: 0, transition: {    delay: 0.4 } }}
             exit={{ opacity: 0,             transition: { duration: 0.8 } }}
      >
        <FontAwesomeIcon icon='bell' />
        <span>Alerts</span>
      </motion.button>
    </>
  );
}
