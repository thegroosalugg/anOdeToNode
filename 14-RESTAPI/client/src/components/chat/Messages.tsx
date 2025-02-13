import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import AsyncAwait from '../panel/AsyncAwait';
import { captainsLog } from '@/util/captainsLog';
import css from './Messages.module.css';

export default function Messages({
     chat,
     user,
  setUser,
}: {
     chat: Chat;
     user: User;
  setUser: Auth['setUser'];
}) {
  const { data: msgs, setData: setMsgs, reqHandler, error } = useFetch<Msg[]>([]);
  const isInitial = useRef(true);

  useEffect(() => {
    const mountData = async () => {
      await reqHandler({ url: `chat/messages/${chat._id}` });
      if (isInitial.current) isInitial.current = false;
      captainsLog([-100, 270], ['🗨️ MESSAGES']);
    };

    mountData();
  }, [chat._id, reqHandler]);

  const  opacity = 0;
  const duration = 0.5;
  const variants = {
     hidden: { opacity },
    visible: { opacity: 1, transition: { duration } }
  };

  return (
    <AsyncAwait {...{ isLoading: isInitial.current, error }}>
      <motion.ul
         className={css['messages']}
           initial='hidden'
           animate='visible'
        transition={{
                 duration,
                     ease: 'easeOut',
            delayChildren: 0.5,
          staggerChildren: 0.1,
        }}
      >
        {msgs.map((msg) => {
          const { _id, createdAt, sender, content } = msg;
          return (
            <motion.li layout key={_id} variants={variants}>
              {content}
            </motion.li>
          );
        })}
      </motion.ul>
    </AsyncAwait>
  );
}
