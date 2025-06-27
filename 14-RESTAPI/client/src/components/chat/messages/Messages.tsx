import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import useFetch from '@/lib/hooks/useFetch';
import useDepedencyTracker from '@/lib/hooks/useDepedencyTracker';
import Msg from '@/models/Message';
import AsyncAwait from '../../ui/boundary/AsyncAwait';
import { formatDate } from '@/lib/util/timeStamps';
import css from './Messages.module.css';
import { useChat } from '../context/ChatContext';
import Chat from '@/models/Chat';

export default function Messages({ chat }: { chat: Chat }) {
  const { user, msgState, loadState, setMsgs, clearAlerts } = useChat();
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
          const     isLast = i === msgs.length - 1;

          return (
            <motion.li
                layout
                   key={_id}
              variants={variants}
              className={user._id === sender ? css["sender"] : ""}
              onAnimationComplete={scrollTo}
            >
              <time>{formatDate(createdAt, ['weekday', 'time'])}</time>
              <p ref={isLast ? msgRef : null}>
                {content}
              </p>
            </motion.li>
          );
        })}
      </motion.ul>
    </AsyncAwait>
  );
}
