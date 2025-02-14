import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import useInitial from '@/hooks/useInitial';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import User from '@/models/User';
import Chat from '@/models/Chat';
import Msg from '@/models/Message';
import AsyncAwait from '../panel/AsyncAwait';
import css from './Messages.module.css';

export default function Messages({
     chat,
     user,
  setUser,
   isMenu,
}: {
     chat: Chat;
     user: User;
  setUser: Auth['setUser'];
  isMenu?: boolean;
}) {
  const { data: msgs, setData: setMsgs, reqHandler, error } = useFetch<Msg[]>([]);
  const { isInitial, mountData } = useInitial();

  useEffect(() => {
    const initData = async () => {
      mountData(async () => await reqHandler({ url: `chat/messages/${chat._id}` }), 4)
    };

    initData();
  }, [chat._id, mountData, reqHandler]);

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
        {msgs.map((msg) => {
          const { _id, createdAt, sender, content } = msg;
          const   isSender = user._id === sender;
          const  alignSelf = isSender ? 'end' : 'start';
          const background = isSender
            ? isMenu
              ? '#fff'
              : 'var(--main-gradient)'
            : 'var(--team-green)';

          const color = isSender ? 'var(--team-green)' : '#fff';

          return (
            <motion.li
                layout
                   key={_id}
                 style={{ alignSelf, color, background }}
              variants={variants}
            >
              {content}
            </motion.li>
          );
        })}
      </motion.ul>
    </AsyncAwait>
  );
}
