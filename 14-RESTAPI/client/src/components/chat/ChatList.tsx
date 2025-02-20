import { AnimatePresence, HTMLMotionProps, LayoutGroup, motion } from 'motion/react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { FetchError } from '@/util/fetchData';
import { Auth } from '@/pages/RootLayout';
import Chat from '@/models/Chat';
import User from '@/models/User';
import Modal from '../modal/Modal';
import ConfirmDialog from '../dialog/ConfirmDialog';
import Button from '../button/Button';
import ProfilePic from '../profile/ProfilePic';
import Counter from '../notifications/Counter';
import Messages from './Messages';
import SendMessage from '../form/SendMessage';
import AsyncAwait from '../panel/AsyncAwait';
import { timeAgo } from '@/util/timeStamps';
import css from './ChatList.module.css';

const    opacity = 0;
const transition = { duration: 0.5, ease: 'linear' };
const animations = {
  initial: { opacity },
  animate: { opacity: 1, transition },
     exit: { opacity },
};

const Span = ({
  isMarked,
     color,
  children,
  ...props
}: {
  isMarked: boolean;
     color: string;
  children: ReactNode;
} & HTMLMotionProps<'span'>) => (
  <motion.span
       animate={{ color: isMarked ? '#fff' : color }}
    transition={transition}
    {...props}
  >
    {children}
  </motion.span>
);

export default function ChatList({
       user, // from parent * 2
    setUser,
      chats, // from hook   * 8
   setChats,
      error,
   isActive,
  isInitial,
  deferring,
     expand,
   collapse,
     isMenu, // optional extra
}: {
        user: User;
     setUser: Auth['setUser'];
       chats: Chat[];
    setChats: Dispatch<SetStateAction<Chat[]>>;
       error: FetchError | null;
    isActive: [Chat]     | null;
   isInitial: boolean;
   deferring: boolean;
      expand: (chat: Chat) => void;
    collapse: () => void;
     isMenu?: boolean;
}) {
  const { reqHandler } = useFetch<Chat[]>([]);
  const [isDeleting,   setIsDeleting] = useState(false);
  const [showModal,     setShowModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Record<string, boolean>>({});
  const  wasMarked = Object.keys(toBeDeleted).some((key) => toBeDeleted[key]);
  const closeModal = () => setShowModal(false);

  const classes = `${css['chat-list']} ${isMenu ? css['isMenu'] : ''}`;
  const  cursor = isActive || deferring ? 'auto' : 'pointer';
  const    flex = isActive ? 1 : 0;

  function setDeletedOrActive(chat: Chat) {
    if (isDeleting) {
      setToBeDeleted((state) => ({ ...state, [chat._id]: !state[chat._id] }));
    } else {
      expand(chat);
    }
  }

  function confirmHandler() {
    if ((isDeleting && wasMarked) || isActive) {
      setShowModal(true);
    } else {
      setIsDeleting(true);
    }
  }

  async function deleteHandler() {
    if (!(isDeleting || isActive)) return;

    let data;
    if (wasMarked) {
      data = Object.fromEntries(Object.entries(toBeDeleted).filter(([_, v]) => v));
    } else if (isActive) {
      data = { [isActive[0]?._id]: true };
    }

    if (!data) return;

    await reqHandler({ url: 'chat/delete', method: 'DELETE', data });
    if (wasMarked) setToBeDeleted({});
    closeModal();
  }

  function cancelDelete() {
    setIsDeleting(false);
    setToBeDeleted({});
  }

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog onCancel={closeModal} onConfirm={deleteHandler} />
      </Modal>
      <AsyncAwait {...{ isLoading: isInitial, error }}>
        <LayoutGroup>
          <motion.ul
             className={classes}
               initial='hidden'
               animate='visible'
            transition={{ staggerChildren: 0.03 }}
          >
            {!isMenu && !isActive?.[0].temp && (
              <section className={css['delete-buttons']}>
                <Button
                  hsl={isDeleting || isActive ? [10, 54, 51] : [0, 0, 81]}
                  onClick={confirmHandler}
                  animateEx={{
                          color: isDeleting || isActive ?      '#fff' : '#000',
                    borderColor: isDeleting || isActive ? '#00000000' : '#000',
                  }}
                >
                  {isDeleting || isActive ? 'Delete' : 'Select'} Chat{!isActive ? 's' : ''}
                </Button>
                <AnimatePresence>
                  {isDeleting && (
                    <Button hsl={[0, 0, 81]} exit={{ opacity }} onClick={cancelDelete}>
                      Cancel
                    </Button>
                  )}
                </AnimatePresence>
              </section>
            )}
            <AnimatePresence>
              {(isActive ?? chats).map((chat, i) => {
                const { _id, host, guest, lastMsg, alerts } = chat;
                const   recipient = user._id === host._id ? guest : host;
                const      sender = lastMsg?.sender === user._id ? 'Me' : recipient.name;
                const         url = `chat/new-msg/${recipient._id}`;
                const    isMarked = toBeDeleted[chat._id];
                const           x = 20 * (i % 2 === 0 ? 1 : -1);
                const borderColor = isMarked ? '#ffffff00' : 'var(--team-green)';
                const  background = isMarked
                  ? 'linear-gradient(to right, #c65740, #ce4429)'
                  : `var(--${isMenu ? 'main' : 'box'}-gradient)`;

                return (
                  <motion.li
                      layout
                         key={_id}
                     onClick={() => setDeletedOrActive(chat)}
                       style={{ cursor }}
                        exit={{  opacity,    flex, x }}
                    variants={{
                       hidden: { opacity,    flex, x },
                      visible: { opacity: 1, flex, x: 0, background, borderColor },
                    }}
                    transition={transition}
                  >
                    <h2>
                      <ProfilePic
                            layout
                           animate={{ borderColor }}
                        transition={transition}
                              user={recipient}
                      />
                      <Span layout {...{ color: '#000', isMarked }}>
                        {recipient.name} {recipient.surname}
                      </Span>
                      <AnimatePresence mode='wait'>
                        {isActive ? (
                          <Button
                             layout
                                key='btn'
                                hsl={[180, 80, 35]}
                               exit={{ opacity }}
                            onClick={collapse}
                          >
                            Back
                          </Button>
                        ) : (
                          <motion.section layout key={lastMsg.updatedAt} {...animations}>
                            <Span {...{ color: 'var(--text-grey)', isMarked }}>
                              {timeAgo(lastMsg.updatedAt)}
                            </Span>
                            <span>
                              <Span {...{ color: 'var(--team-green)', isMarked }}>
                                {'🗨️' + sender}
                              </Span>
                              <Counter count={alerts[user._id]} />
                            </span>
                            <Span {...{ color: 'var(--dark-grey)', isMarked }}>
                              {lastMsg.content}
                            </Span>
                          </motion.section>
                        )}
                      </AnimatePresence>
                    </h2>
                    <AnimatePresence>
                      {isActive && (
                        <>
                          <Messages    {...{    user, isMenu, chat, setChats }} />
                          <SendMessage {...{ setUser, isMenu, url }} />
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
    </>
  );
}
