import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import useInitial from '@/hooks/useInitial';
import useFetch from '@/hooks/useFetch';
import { ChatListener } from '@/hooks/useChatListener';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import AsyncAwait from '../panel/AsyncAwait';
import { formatDate } from '@/util/timeStamps';
import css from './Messages.module.css';

export default function Messages({
         chat,
     setChats,
         msgs,
      setMsgs,
  clearAlerts,
         user,
       isMenu,
}: {
  user: User;
  chat: Chat;
  msgs: Msg[];
} & Pick<ChatListener, 'setMsgs' | 'setChats' | 'isMenu' | 'clearAlerts'>) {
  const { reqHandler, error } = useFetch<Msg[]>([]);
  const { isInitial, mountData } = useInitial();
  const msgRef = useRef<HTMLParagraphElement>(null);
  const scrollTo = () => msgRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const markAlertsAsRead = async () => {
      if (chat.alerts[user._id] <= 0) return;
      clearAlerts(chat._id);
    };

    const getMessages = async () => {
      if (msgs.length > 0) return;
      await reqHandler(
        { url: `chat/messages/${chat._id}` },
        { onSuccess: (msgs) => setMsgs((state) => ({ ...state, [chat._id]: msgs })) }
      );
    };

    const initData = async () => {
      mountData(async () => {
        await Promise.all([
          getMessages(),
          markAlertsAsRead(),
        ]);
      }, 4);
    };

    if (isInitial) {
      initData();
    } else {
      markAlertsAsRead();
    }
    
  }, [
    user._id,
    chat._id,
    chat.alerts,
    msgs.length,
    isInitial,
    clearAlerts,
    setChats,
    mountData,
    reqHandler,
    setMsgs,
  ]);

  const  classes = `${css['messages']} ${isMenu ? css['isMenu'] : ''}`;
  const  opacity = 0;
  const duration = 0.5;
  const variants = {
     hidden: { opacity },
    visible: { opacity: 1, transition: { duration } }
  };

  return (
    <AsyncAwait {...{ isLoading: isInitial && msgs.length < 1, error }}>
      <motion.ul
         className={classes}
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
          const alignItems = isSender ?               'end' : 'start';
          const     margin = isSender ?        '0 0 0 1rem' : '0 1rem 0 0';
          const      color = isSender ? 'var(--team-green)' :  '#fff';
          const background = isSender
            ? isMenu
              ? '#fff'
              : 'var(--main-gradient)'
            : 'var(--team-green)';

          return (
            <motion.li
                layout
                   key={_id}
              variants={variants}
                 style={{ alignItems, margin }}
              onAnimationComplete={scrollTo}
            >
              <time>{formatDate(createdAt, ['time'])}</time>
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
