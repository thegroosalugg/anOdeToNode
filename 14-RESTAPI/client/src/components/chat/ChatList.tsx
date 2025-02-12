import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import Chat from '@/models/Chat';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import Messages from './Messages';
import SendMessage from '../form/SendMessage';
import AsyncAwait from '../panel/AsyncAwait';
import { captainsLog } from '@/util/captainsLog';
import css from './ChatList.module.css';

export default function ChatList({
     user,
  setUser,
   isMenu,
}: {
      user: User;
   setUser: Auth['setUser'];
   isMenu?: boolean;
}) {
  const {
          data: chats,
       setData: setChats,
    reqHandler: reqChats,
         error,
  } = useFetch<Chat[]>([]);
  const { reqHandler: reqActiveChat } = useFetch<Chat>();
  const [isActive, setIsActive] = useState<[Chat] | null>(null);
  const { deferring,  deferFn } = useDebounce();
  const {       userId        } = useParams();
  const       isInitial         = useRef(true);

  useEffect(() => {
    const getActiveChat = async () => {
      if (userId && !isMenu) {
        await reqActiveChat(
          { url: `chat/find/${userId}` },
          { onSuccess: (chat) => setIsActive([chat]) }
        );
      }
    };

    const mountData = async () => {
      await Promise.all([
        reqChats({ url: 'chat/all' }),
        getActiveChat()
      ]);
      if (isInitial.current) isInitial.current = false;
    };

    mountData();
    captainsLog([-100, 290], ['🗨️ CHAT LIST']);
  }, [userId, isMenu, reqActiveChat, reqChats]);


  function expand(chat: Chat) {
    if (!isActive) deferFn(() => setIsActive([chat]), 2500);
  }

  function collapse() {
    setIsActive(null);
  }

  const     cursor = isActive || deferring ? 'auto' : 'pointer';
  const       flex = isActive ? 1 : 0;
  const    opacity = 0;
  const          x = 20;
  const        dir = (n: number) => n % 2 === 0 ? 1 : -1;
  const transition = { duration: 0.5, ease: 'linear' };

  return (
    <AsyncAwait {...{ isLoading: isInitial.current, error }}>
      <LayoutGroup>
        <motion.ul className={css['chat-list']}>
          <AnimatePresence>
            {(isActive ?? chats).map((chat, i) => {
              const { _id, user: host, peer } = chat;
              const recipient = user._id === host._id ? peer : host;
              return (
                <motion.li
                      layout
                        key={_id}
                    onClick={() => expand(chat)}
                      style={{ cursor }}
                    initial={{ opacity,    flex, x: x * dir(i) }}
                    animate={{ opacity: 1, flex, x: 0          }}
                       exit={{ opacity,    flex, x             }}
                  transition={transition}
                >
                  <motion.h2 layout='position' transition={transition}>
                    <ProfilePic user={recipient} />
                    <span>
                      {recipient.name} {recipient.surname}
                    </span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.button
                          initial={{ opacity }}
                          animate={{ opacity: 1, transition }}
                             exit={{ opacity }}
                          onClick={collapse}
                        >
                          Back
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.h2>
                  {isActive && (
                    <>
                      <Messages    {...{ chat, setUser }} />
                      <SendMessage {...{ url: '', setUser, isMenu }} />
                    </>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </AsyncAwait>
  );
}
