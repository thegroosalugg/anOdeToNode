import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import useInitial from '@/hooks/useInitial';
import useFetch from '@/hooks/useFetch';
import { BASE_URL } from '@/util/fetchData';
import { io } from 'socket.io-client';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import AsyncAwait from '../panel/AsyncAwait';
import { formatDate } from '@/util/timeStamps';
import { captainsLog } from '@/util/captainsLog';
import css from './Messages.module.css';

export default function Messages({
     chat,
     user,
   isMenu,
}: {
     chat: Chat;
     user: User;
  isMenu?: boolean;
}) {
  const { data: msgs, setData: setMsgs, reqHandler, error } = useFetch<Msg[]>([]);
  const { isInitial, mountData } = useInitial();
  const msgRef = useRef<HTMLParagraphElement>(null);
  const scrollTo = () => msgRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const initData = async () => {
      mountData(async () => await reqHandler({ url: `chat/messages/${chat._id}` }), 4)
    };

    initData();

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog([-100, 270], ['🗨️ MESSAGES: Socket connected']));

    socket.on(`chat:${user._id}:update`, ({ msg }) => setMsgs((prevMsgs) => {
        captainsLog([-100, 265], ['🗨️ MESSAGES: New Msg', msg]);
        return [...prevMsgs, msg];
      })
    );

    return () => {
      socket.off('connect');
      socket.off(`chat:${user._id}:update`);
      socket.disconnect();
      captainsLog([-100, 270], ['🗨️ MESSAGES disconnect']); // **LOGDATA
      };
  }, [user._id, chat._id, mountData, reqHandler, setMsgs]);

  const  classes = `${css['messages']} ${isMenu ? css['isMenu'] : ''}`;
  const  opacity = 0;
  const duration = 0.5;
  const variants = {
     hidden: { opacity },
    visible: { opacity: 1, transition: { duration } }
  };

  return (
    <AsyncAwait {...{ isLoading: isInitial, error }}>
      <motion.ul
         className={classes}
           initial='hidden'
           animate='visible'
              exit={{ opacity }}
        transition={{
                 duration,
                     ease: 'easeOut',
            delayChildren: 0.5,
          staggerChildren: 0.1,
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
