import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import Chat from '@/models/Chat';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import css from './ChatList.module.css';

export default function ChatList({ user, chats }: { user: User; chats: Chat[] }) {
  const [isActive, setIsActive] = useState<[Chat] | null>(null);
  const { deferring, deferFn } = useDebounce();

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
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
