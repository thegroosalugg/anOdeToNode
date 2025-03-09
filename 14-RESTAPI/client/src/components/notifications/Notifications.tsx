import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import useSocket from '@/hooks/useSocket';
import useDebounce from '@/hooks/useDebounce';
import { FetchError } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import Reply from '@/models/Reply';
import Logger from '@/models/Logger';
import PortalMenu from '../panel/PortalMenu';
import AsyncAwait from '../panel/AsyncAwait';
import SocialAlerts from './SocialAlerts';
import ReplyAlerts from './ReplyAlerts';
import NavButton from '../navigation/NavButton';
import Counter from './Counter';
import css from './Notifications.module.css';

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
  } = useFetch<Reply[]>([]);
  const [menu,                  showMenu] = useState(false);
  const [activeTab,         setActiveTab] = useState(0);
  const { deferring,            deferFn } = useDebounce();
  const              isInitial            = useRef(true);
  const              socketRef            = useSocket('alerts');
  const               navigate            = useNavigate();

  const { friends } = user;

  const [inbound, outbound] = friends.reduce(
    ([inTotal, outTotal], { initiated, accepted, meta }) => {
      if (!meta.read) {
        if (           !initiated)  inTotal += 1;
        if (accepted && initiated) outTotal += 1;
      }
      return [inTotal, outTotal];
    },
    [0, 0]
  );

  const newReplies = replies.reduce((total, { meta }) => {
    if (!meta.read) total += 1;
    return total;
  }, 0);

  const alerts = inbound + outbound + newReplies;

  const markSocialsAsRead = useCallback(
    async (index = activeTab) =>
      await reqSocialAlerts(
        { url: `alerts/social?type=${['inbound', 'outbound'][index]}` },
        { onSuccess: (updated) => setUser(updated) }
      ),
    [activeTab, reqSocialAlerts, setUser]
  );

  const markRepliesAsRead = useCallback(
    async () => await reqReplyAlerts({ url: 'alerts/replies?read=true' }),
    [reqReplyAlerts]
  );

  const handleAlerts = async (index = activeTab) => {
    if (index < 2) await markSocialsAsRead(index);
    else           await markRepliesAsRead();
  };

  const openMenu = async () => {
    isInitial.current = true;
    deferFn(async () => {
      showMenu(true);
      await handleAlerts();
      isInitial.current = false;
    }, 1500);
  };

  const changeTab = async (index: number) => {
    setActiveTab(index);
    await handleAlerts(index);
  };

  const navTo = (path: string) => {
    showMenu(false);
    navigate(path);
  };

  const onError = (err: FetchError) => {
    if (err.status === 401) setUser(null);
  };

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const initData = async () => {
      if (isInitial.current) {
        await reqReplyAlerts({ url: 'alerts/replies' });
        isInitial.current = false;
      }
    };

    initData();

    const logger = new Logger('alerts');
    socket.on('connect', () => logger.connect());

    socket.on(`peer:${user._id}:update`, async (updated) => {
      logger.event('update', updated);
      if (menu && activeTab < 2) {
        await markSocialsAsRead();
      } else {
        setUser(updated);
      }
    });

    socket.on(`nav:${user._id}:reply`, async ({ action, reply }) => {
      logger.event(`reply, action: ${action}`, reply);
      if (menu && activeTab === 2) {
        await markRepliesAsRead();
      } else {
        if (action === 'new') {
          setReplies((prev) => [reply, ...prev]);
        } else if (action === 'delete') {
          setReplies((prev) => prev.filter(({ _id }) => _id !== reply._id))
        }
      }
    });

    return () => {
      socket.off('connect');
      socket.off(`peer:${user._id}:update`);
      socket.off(`nav:${user._id}:reply`);
      logger.off();
    };
  }, [
    socketRef,
    menu,
    activeTab,
    user._id,
    reqReplyAlerts,
    markSocialsAsRead,
    markRepliesAsRead,
    setUser,
    setReplies,
  ]);

  const icons = ['envelope', 'paper-plane', 'reply'] as const;

  return (
    <>
      <PortalMenu show={menu} close={() => showMenu(false)}>
        <section className={css['menu-bar']}>
          {[inbound, outbound, newReplies].map((count, i) => (
            <motion.button
                  key={i}
              onClick={() => changeTab(i)}
              animate={{ color: activeTab === i ? '#888' : 'var(--team-green)' }}
            >
              <FontAwesomeIcon icon={icons[i]} size='xl' />
              <Counter {...{ count, pos: [15, 2, 0] }} />
            </motion.button>
          ))}
        </section>
        <AsyncAwait {...{ isLoading: isInitial.current, error }}>
          <AnimatePresence mode='wait'>
            {activeTab === 2 ? (
              <ReplyAlerts key='replies' {...{ replies, setReplies, navTo, onError }} />
            ) : (
              <SocialAlerts
                key='friends'
                {...{ setUser, friends, activeTab, navTo, onError }}
              />
            )}
          </AnimatePresence>
        </AsyncAwait>
      </PortalMenu>
      <NavButton {...{ index: 2, deferring, callback: openMenu }}>
        <Counter count={alerts} />
      </NavButton>
    </>
  );
}
