import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import useInitial from '@/hooks/useInitial';
import useFetch from '@/hooks/useFetch';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import Chat from '@/models/Chat';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import Messages from './Messages';
import SendMessage from '../form/SendMessage';
import AsyncAwait from '../panel/AsyncAwait';
import { timeAgo } from '@/util/timeStamps';
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
  const [ isActive,     setIsActive ] = useState<[Chat] | null>(null);
  const { deferring,        deferFn } = useDebounce();
  const { isInitial,      mountData } = useInitial();
  const {           userId          } = useParams();

  useEffect(() => {
    const getActiveChat = async () => {
      if (userId && !isMenu) {
        await reqActiveChat(
          { url: `chat/find/${userId}` },
          { onSuccess: (chat) => setIsActive([chat]) }
        );
      }
    };

    const initData = async () =>
      mountData(
        async () => await Promise.all([
          reqChats({ url: 'chat/all' }),
          getActiveChat()
        ]),
        5
      );

    initData();

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog([-100, 290], ['CHAT LIST 💬: Socket connected']));

    socket.on(`chat:${user._id}:update`, ({ chat, isNew }) => {
      if (chat._id === isActive?.[0]._id) setIsActive([chat]);

      setChats((prevChats) => {
        captainsLog([-100, 285], [`CHAT LIST 💬: Update, isNew ${isNew}`, chat]);
        if (isNew) return [chat, ...prevChats];
        else       return prevChats.map((prev) => (prev._id === chat._id ? chat : prev));
      });
    });

    return () => {
      socket.off('connect');
      socket.off(`chat:${user._id}:update`);
      socket.disconnect();
      captainsLog([-100, 290], ['CHAT LIST 💬 disconnect']); // **LOGDATA
      };
    }, [user._id, userId, isActive, isMenu, mountData, reqActiveChat, reqChats, setChats]);


  function expand(chat: Chat) {
    if (!isActive) deferFn(() => setIsActive([chat]), 2500);
  }

  function collapse() {
    setIsActive(null);
  }

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
              const { _id, host, guest, lastMsg } = chat;
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
                  <motion.h2 layout transition={transition}>
                    <ProfilePic user={recipient} />
                    <span>
                      {recipient.name} {recipient.surname}
                    </span>
                    <AnimatePresence mode='wait'>
                      {isActive ? (
                        <motion.button key='btn' onClick={collapse} {...animations}>
                          Back
                        </motion.button>
                      ) : (
                        <motion.section key='msg' {...animations}>
                          {sender}
                          {timeAgo(lastMsg.createdAt)}
                          {lastMsg.content}
                        </motion.section>
                      )}
                    </AnimatePresence>
                  </motion.h2>
                  <AnimatePresence>
                    {isActive && (
                      <>
                        <Messages    {...{    user, isMenu, chat }} />
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
