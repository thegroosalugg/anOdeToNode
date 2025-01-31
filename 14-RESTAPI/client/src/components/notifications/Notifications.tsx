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
import Reply from '@/models/Reply';
import FriendAlerts from './FriendAlerts';
import ReplyAlerts from './ReplyAlerts';
import AsyncAwait from '../panel/AsyncAwait';
import { captainsLog } from '@/util/captainsLog';
import nav from '../navigation/NavButton.module.css';
import css from './Notifications.module.css';

export type Menu = 'received' | 'sent' | 'replies';

export default function Notifications({
     user,
  setUser,
}: {
     user: User;
  setUser: Auth['setUser'];
}) {
  const { error, reqHandler: reqSocialAlerts } = useFetch<User>();
  const {
          data: replies,
       setData: setReplies,
    reqHandler: reqReplyAlerts,
  } = useFetch<Reply[]>([]);  const [      menu,    showMenu ] = useState(false);
  const [  menuType, setMenuType ] = useState<Menu>('received');
  const { deferring,     deferFn } = useDebounce();
  const   menuRef = useRef<HTMLUListElement>(null);
  const isInitial = useRef(true);
  const { friends } = user;
  const  alerts = friends.reduce((total, { initiated, accepted, meta }) => {
    if ((!initiated || (accepted && initiated)) && !meta.read) total += 1;
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

  const getFriendAlerts = useCallback(
    async () =>
      await reqSocialAlerts(
        { url: 'alert/social/read', method: 'POST' },
        { onSuccess: (updated) => setUser(updated) }
      ),
    [reqSocialAlerts, setUser]
  );

  const getReplyAlerts = useCallback(
    async () => await reqReplyAlerts({ url: 'alert/replies/read', method: 'POST' }),
    [reqReplyAlerts]
  );

  const openMenu = async () => {
    isInitial.current = true;
    deferFn(async () => {
      showMenu(true);
      await Promise.all([getFriendAlerts(), getReplyAlerts()]);
      isInitial.current = false
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
    socket.on('connect', () => captainsLog([-100, 15], ['NAV: Socket connected']));

    socket.on(`peer:${user._id}:update`, async (updated) => {
      captainsLog([-100, 15], ['NAV: UPDATE', updated]);
      if (menu) {
        await getFriendAlerts();
      } else {
        setUser(updated);
      }
    });

    socket.on(`nav:${user._id}:reply`, (reply) => {
      captainsLog([-100, 12], ['NAV: NEW REPLY', reply]);
      setReplies((prev) => [reply, ...prev]);
    })

    return () => {
      socket.off('connect');
      socket.off(`peer:${user?._id}:update`);
      socket.off(`nav:${user._id}:reply`);
      socket.disconnect();
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [menu, user._id, getFriendAlerts, getReplyAlerts, setUser, setReplies]);

  const icons = {
    received: 'envelope',
        sent: 'paper-plane',
     replies: 'reply',
  } as const;

  return (
    <>
      <AnimatePresence>
        {menu && (
          <motion.ul className={css['notifications']} ref={menuRef} {...animation}>
            <section className={css['menu-bar']}>
              {(['received', 'sent', 'replies'] as Menu[]).map((name) => (
                <motion.button
                      key={name}
                  onClick={() => setMenuType(name)}
                  animate={{ color: menuType === name ? '#888' : 'var(--team-green)' }}
                >
                  <FontAwesomeIcon icon={icons[name]} />
                </motion.button>
              ))}
            </section>
            <AsyncAwait {...{ isLoading: isInitial.current, error }}>
              {menuType === 'replies' ? (
                <ReplyAlerts {...{ replies }} />
              ) : (
                <FriendAlerts
                  {...{ setUser, friends, menuType, closeMenu: () => showMenu(false) }}
                />
              )}
            </AsyncAwait>
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
