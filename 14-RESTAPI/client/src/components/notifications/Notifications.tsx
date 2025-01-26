import { isMobile } from 'react-device-detect';
import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import { captainsLog } from '@/util/captainsLog';
import nav from '../navigation/NavButton.module.css';
import css from './Notifications.module.css';

export default function Notifications({
     user,
  setUser,
}: {
     user: User;
  setUser: Auth['setUser'];
}) {
  const { reqHandler } = useFetch<User>();
  const [menu, showMenu] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const  alerts = user.friends.reduce((total, { status, meta }) => {
    if (status !== 'sent' && !meta.read) total += 1;
    return total;
  }, 0);

  const isLandscape = window.matchMedia('(orientation: landscape)').matches && isMobile;
  const [x, y] = isLandscape ? [75, 0] : [0, 75];
  const animation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
       exit: { opacity: 0 },
  };

  const openMenu = async () => {
    showMenu(true);
    await reqHandler(
      { url: 'notify/read', method: 'POST' },
      { onSuccess: (updated) => setUser(updated) }
    );
  };

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
          <motion.ul className={css['notifications']} ref={menuRef} {...animation}>
          {user.friends.map((friend) => {
            const { status, user: peer } = friend;
            if (typeof peer === 'object') {
              return (
                <li key={peer._id}>
                  {status === 'received'
                    ? `${peer.name} sent you a friend request`
                    : `You are now friends with ${peer.name}`}
                </li>
              );
            }
          })}
        </motion.ul>
        )}
      </AnimatePresence>
      <motion.button
        className={nav['nav-button']}
          onClick={openMenu}
          initial={{ opacity: 0, y,    x }}
          animate={{ opacity: 1, y: 0, x: 0, transition: {    delay: 0.4 } }}
             exit={{ opacity: 0,             transition: { duration: 0.8 } }}
      >
        <FontAwesomeIcon icon='bell' />
        <span>Alerts</span>
        <AnimatePresence>
          {alerts > 0 && (
            <motion.span className={css['alert']} {...animation}>
              {alerts}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
