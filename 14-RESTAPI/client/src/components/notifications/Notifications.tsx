import { AnimatePresence, motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import useInitial from '@/hooks/useInitial';
import useDebounce from '@/hooks/useDebounce';
import { io } from 'socket.io-client';
import { BASE_URL, FetchError } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import Reply from '@/models/Reply';
import PortalMenu from '../panel/PortalMenu';
import AsyncAwait from '../panel/AsyncAwait';
import SocialAlerts from './SocialAlerts';
import ReplyAlerts from './ReplyAlerts';
import NavButton from '../navigation/NavButton';
import Counter from './Counter';
import { captainsLog } from '@/util/captainsLog';
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
  const [      menu,     showMenu ] = useState(false);
  const [ activeTab, setActiveTab ] = useState(0);
  const { deferring,      deferFn } = useDebounce();
  const { isInitial, mountData, setInit } = useInitial();
  const    navigate = useNavigate();
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
    setInit(true);
    deferFn(async () => {
      showMenu(true);
      await handleAlerts();
      setInit(false);
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
    const initData = async () =>
      mountData(async () => await reqReplyAlerts({ url: 'alerts/replies' }), 3);
    initData();

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog([-100, 208], ['🧭 NAV: Socket connected']));

    socket.on(`peer:${user._id}:update`, async (updated) => {
      captainsLog([-100, 212], ['🧭 NAV: SOCIAL', updated]);
      if (menu && activeTab < 2) {
        await markSocialsAsRead();
      } else {
        setUser(updated);
      }
    });

    socket.on(`nav:${user._id}:reply`, async ({ action, reply }) => {
      captainsLog([-100, 200], [`🧭 NAV: ${action} REPLY`, reply]);
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
      socket.disconnect();
      captainsLog([-10, 204], ['🧭 NAV Disconnect']);
    };
  }, [
    menu,
    activeTab,
    user._id,
    mountData,
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
              <FontAwesomeIcon icon={icons[i]} />
              <Counter {...{ count, scale: 0.5 }} />
            </motion.button>
          ))}
        </section>
        <AsyncAwait {...{ isLoading: isInitial, error }}>
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
