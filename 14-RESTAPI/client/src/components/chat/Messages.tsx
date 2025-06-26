import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import useFetch from '@/hooks/useFetch';
import useDepedencyTracker from '@/hooks/useDepedencyTracker';
import { ChatListener } from '@/hooks/useChatListener';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import AsyncAwait from '../panel/AsyncAwait';
import { formatDate } from '@/util/timeStamps';
import css from './Messages.module.css';

export default function Messages({
         chat,
     msgState,
    loadState,
      setMsgs,
  clearAlerts,
         user,
       isMenu,
}: {
  user: User;
  chat: Chat;
} & Pick<ChatListener, 'msgState' | 'loadState' | 'setMsgs' | 'isMenu' | 'clearAlerts'>) {
  const      msgs = msgState[chat._id] || [];
  const hasLoaded = loadState.current[chat._id];
  const { reqHandler, error } = useFetch<Msg[]>([]);
  const isInitial = useRef(true);
  const    msgRef = useRef<HTMLParagraphElement>(null);
  const  scrollTo = () => msgRef.current?.scrollIntoView({ behavior: 'smooth' });

  useDepedencyTracker('chat', {
       reqUser: user._id,
        chatId: chat._id,
    chatAlerts: chat.alerts,
    chatIsTemp: chat.isTemp,
     loadState,
     hasLoaded,
  });

  useEffect(() => {
    if (chat.isTemp) return;

    const markAlertsAsRead = async () => {
      if (chat.alerts[user._id] <= 0) return;
      clearAlerts(chat._id);
    };

    const getMessages = async () => {
      if (hasLoaded) return;
      await reqHandler(
        { url: `chat/messages/${chat._id}` },
        {
          onSuccess: (msgs) => {
            setMsgs((state) => ({ ...state, [chat._id]: msgs }));
            loadState.current[chat._id] = true;
          },
        }
      );
    };

    const initData = async () => {
      await Promise.all([getMessages(), markAlertsAsRead()]);
      isInitial.current = false;
    };

    if (isInitial.current) initData();
    else           markAlertsAsRead();
  }, [
    user._id,
    chat._id,
    chat.alerts,
    chat.isTemp,
    loadState,
    hasLoaded,
    clearAlerts,
    reqHandler,
    setMsgs,
  ]);

  const  opacity = 0;
  const duration = 0.5;
  const variants = {
     hidden: { opacity },
    visible: { opacity: 1, transition: { duration } },
  };

  const isLoading = isInitial.current && msgs.length < 1 && !chat.isTemp;

  return (
    <AsyncAwait {...{ isLoading, error }}>
      <motion.ul
         className={css['messages']}
           initial='hidden'
           animate='visible'
              exit={{ opacity }}
        transition={{
                 duration,
                     ease: 'easeOut',
            delayChildren: 0.5,
          staggerChildren: msgs.length < 20 ? 0.1 : 0,
        }}
      >
        {msgs.map((msg, i) => {
          const { _id, createdAt, sender, content } = msg;
          const   isSender = user._id === sender;
          const     isLast = i === msgs.length - 1;
          const alignItems = isSender ?           'end' : 'start';
          const     margin = isSender ?    '0 0 0 1rem' : '0 1rem 0 0';
          const      color = isSender ? 'var(--accent)' :  '#fff';
          const background = isSender
            ? isMenu
              ? '#fff'
              : 'var(--main-gradient)'
            : 'var(--accent)';

          return (
            <motion.li
                layout
                   key={_id}
              variants={variants}
                 style={{ alignItems, margin }}
              onAnimationComplete={scrollTo}
            >
              <time>{formatDate(createdAt, ['weekday', 'time'])}</time>
              <p ref={isLast ? msgRef : null} style={{ color, background }}>
                {content}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </AsyncAwait>
  );
}
