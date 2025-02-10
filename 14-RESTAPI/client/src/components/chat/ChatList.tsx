import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';
import Chat from '@/models/Chat';
import User from '@/models/User';
import ProfilePic from '../profile/ProfilePic';
import css from './ChatList.module.css';

export default function ChatList({ user, chats }: { user: User; chats: Chat[] }) {
  const [isActive, setIsActive] = useState<[Chat] | null>(null);

  function expand(chat: Chat) {
    if (!isActive) setIsActive([chat]);
  }

  function collapse() {
    setIsActive(null);
  }

  const     cursor = isActive ? 'auto' : 'pointer';
  const       flex = isActive ? 1 : 0;
  const    opacity = 0;
  const          x = 20;
  const        dir = (n: number) => n % 2 === 0 ? 1 : -1;
  const   duration = 0.5;
  const     layout = { layout: { duration, ease: 'linear' }           };
  const transition = {           duration, ease: 'easeIn', delay: 0.5 };

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
                     style={{ flex, cursor }}
                   initial={{ opacity,    x: x * dir(i)    }}
                   animate={{ opacity: 1, x: 0, transition }}
                      exit={{ opacity,    x                }}
                transition={layout}
              >
                <motion.h2 layout transition={layout}>
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
