import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/lib/hooks/useFetch';
import useSocket from '@/lib/hooks/useSocket';
import useDebounce from '@/lib/hooks/useDebounce';
import useDepedencyTracker from '@/lib/hooks/useDepedencyTracker';
import { FetchError } from '@/lib/types/common';
import { Auth } from '@/lib/types/auth';
import User from '@/models/User';
import Reply from '@/models/Reply';
import Logger from '@/models/Logger';
import PortalMenu from '../ui/menu/PortalMenu';
import AsyncAwait from '../ui/boundary/AsyncAwait';
import SocialAlerts from './SocialAlerts';
import ReplyAlerts from './ReplyAlerts';
import NavButton from '../layout/header/NavButton';
import Counter from './Counter';
import css from './Notifications.module.css';

export default function Notifications({
     user,
  setUser,
}: {
     user: User;
  setUser: Auth['setUser'];
}) {
  const { error, reqData: reqSocialAlerts } = useFetch<User>();
  const {
       data: replies,
    setData: setReplies,
    reqData: reqReplyAlerts,
  } = useFetch<Reply[]>([]);
  const [menu,                  showMenu] = useState(false);
  const [activeTab,         setActiveTab] = useState(0);
  const { deferring,            deferFn } = useDebounce();
  const              isInitial            = useRef(true);
  const              socketRef            = useSocket('alerts');
  const               navigate            = useNavigate();
  const {             friends           } = user;
  const [inbound,               outbound] = friends.reduce(
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

  const  count = inbound + outbound + newReplies;
  const alerts = [inbound, outbound, newReplies];
  const  icons = ['envelope', 'paper-plane', 'reply'] as const;

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
    if (alerts[index] > 0) {
      if (index < 2) {
        await markSocialsAsRead(index);
      } else {
        await markRepliesAsRead();
      }
    }
  };

  const openMenu = async () => {
    deferFn(async () => {
      showMenu(true);
      await handleAlerts();
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

  useDepedencyTracker('alerts', {
    isInitial: isInitial.current,
    socketRef,
         menu,
    activeTab,
      reqUser: user._id,
  });

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
      logger.event('peer:update', updated);
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

  return (
    <>
      <PortalMenu show={menu} close={() => showMenu(false)}>
        <section className={css['menu-bar']}>
          {alerts.map((count, i) => (
            <motion.button
                  key={i}
              onClick={() => changeTab(i)}
              animate={{ color: activeTab === i ? '#888' : 'var(--accent)' }}
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
        <Counter {...{count}} />
      </NavButton>
    </>
  );
}
