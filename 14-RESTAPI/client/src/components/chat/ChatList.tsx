import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { Dispatch, SetStateAction } from 'react';
import { Auth } from '@/pages/RootLayout';
import Chat from '@/models/Chat';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import Counter from '../notifications/Counter';
import Messages from './Messages';
import SendMessage from '../form/SendMessage';
import AsyncAwait from '../panel/AsyncAwait';
import { timeAgo } from '@/util/timeStamps';
import css from './ChatList.module.css';
import { FetchError } from '@/util/fetchData';

export default function ChatList({
       user,
    setUser,
      chats,
   setChats,
      error,
   isActive,
  isInitial,
  deferring,
     expand,
   collapse,
     isMenu,
}: {
        user: User;
     setUser: Auth['setUser'];
       chats: Chat[];
    setChats: Dispatch<SetStateAction<Chat[]>>;
       error: FetchError | null;
    isActive: [Chat] | null;
   isInitial: boolean;
   deferring: boolean;
      expand: (chat: Chat) => void;
    collapse: () => void;
     isMenu?: boolean;
}) {
  const    classes = `${css['chat-list']} ${isMenu ? css['isMenu'] : ''}`;
  const background = `var(--${isMenu ? 'main' : 'box'}-gradient)`
  const     cursor = isActive || deferring ? 'auto' : 'pointer';
  const       flex = isActive ? 1 : 0;
  const    opacity = 0;
  const transition = { duration: 0.5, ease: 'linear' };
  const animations = {
    initial: { opacity },
    animate: { opacity: 1, transition },
       exit: { opacity },
  };

  return (
    <AsyncAwait {...{ isLoading: isInitial, error }}>
      <LayoutGroup>
        <motion.ul
           className={classes}
             initial='hidden'
             animate='visible'
          transition={{ staggerChildren: 0.03 }}
        >
          <AnimatePresence>
            {(isActive ?? chats).map((chat, i) => {
              const { _id, host, guest, lastMsg, alerts } = chat;
              const recipient =        user._id === host._id ? guest : host;
              const    sender = lastMsg?.sender === user._id ?  'Me' : recipient.name;
              const       url = `chat/new-msg/${recipient._id}`;
              const         x = 20 * (i % 2 === 0 ? 1 : -1);

              return (
                <motion.li
                      layout
                        key={_id}
                    onClick={() => expand(chat)}
                      style={{ cursor,   background }}
                       exit={{  opacity,    flex, x }}
                   variants={{
                      hidden: { opacity,    flex, x    },
                     visible: { opacity: 1, flex, x: 0 },
                   }}
                 transition={transition}
                >
                  <h2>
                    <ProfilePic layout transition={transition} user={recipient} />
                    <motion.span layout transition={transition}>
                      {recipient.name} {recipient.surname}
                    </motion.span>
                    <AnimatePresence mode='wait'>
                      {isActive ? (
                        <motion.button layout key='btn' onClick={collapse} {...animations}>
                          Back
                        </motion.button>
                      ) : (
                        <motion.section layout key={lastMsg.updatedAt} {...animations}>
                          <span>{timeAgo(lastMsg.updatedAt)}</span>
                          <span>
                            <span>{sender}</span>
                            <Counter count={alerts?.[user._id]} />
                          </span>
                          <span>{lastMsg.content}</span>
                        </motion.section>
                      )}
                    </AnimatePresence>
                  </h2>
                  <AnimatePresence>
                    {isActive && (
                      <>
                        <Messages    {...{    user, isMenu, chat, setChats }} />
                        <SendMessage {...{ setUser, isMenu, url  }} />
                      </>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </AsyncAwait>
  );
}
