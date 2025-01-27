import { isMobile } from 'react-device-detect';
import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import useDebounce from '@/hooks/useDebounce';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import FriendAlerts from './FriendAlerts';
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
  const {     reqHandler     } = useFetch<User>();
  const [ menu,     showMenu ] = useState(false);
  const { deferring, deferFn } = useDebounce();
  const menuRef = useRef<HTMLUListElement>(null);
  const { friends } = user;
  const  alerts = friends.reduce((total, { status, meta }) => {
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
  const opacity = deferring ? 0.6 : 1;

  const getAlerts = useCallback(
    async () =>
      await reqHandler(
        { url: 'notify/read', method: 'POST' },
        { onSuccess: (updated) => setUser(updated) }
      ),
    [reqHandler, setUser]
  );

  const openMenu = async () => {
    deferFn(async () => {
      showMenu(true);
      await getAlerts();
    }, 1500)
  };

  const closeMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      showMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog(-100, 15, ['NAV: Socket connected']));

    socket.on(`peer:${user._id}:update`, async (updated) => {
      captainsLog(-100, 15, ['NAV: UPDATE', updated]);
      if (menu) {
        await getAlerts();
      } else {
        setUser(updated);
      }
    });

    return () => {
      socket.off('connect');
      socket.off(`peer:${user?._id}:update`);
      socket.disconnect();
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [menu, user._id, getAlerts, setUser]);

  return (
    <>
      <AnimatePresence>
        {menu && (
          <motion.ul className={css['notifications']} ref={menuRef} {...animation}>
            <FriendAlerts
              {...{ user, setUser, friends, closeMenu: () => showMenu(false) }}
            />
          </motion.ul>
        )}
      </AnimatePresence>
      <motion.button
        className={nav['nav-button']}
          onClick={openMenu}
         disabled={deferring}
          initial={{ opacity: 0, y,    x }}
          animate={{ opacity,    y: 0, x: 0, transition: {    delay: 0.4 } }}
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
