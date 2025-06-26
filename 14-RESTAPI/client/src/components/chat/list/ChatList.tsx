import { isMobile } from 'react-device-detect';
import { AnimatePresence, HTMLMotionProps, LayoutGroup, motion } from 'motion/react';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/lib/hooks/useFetch';
import { Auth } from '@/pages/RootLayout';
import { ChatListener } from '@/lib/hooks/useChatListener';
import Chat from '@/models/Chat';
import User from '@/models/User';
import Modal from '../../ui/modal/Modal';
import ConfirmDialog from '../../ui/modal/ConfirmDialog';
import Button from '../../ui/button/Button';
import ProfilePic from '../../ui/image/ProfilePic';
import Counter from '../../notifications/Counter';
import Messages from '../messages/Messages';
import SendMessage from '../../form/SendMessage';
import AsyncAwait from '../../ui/boundary/AsyncAwait';
import { timeAgo } from '@/lib/util/timeStamps';
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
     color = "var(--text)",
  children,
  ...props
}: {
  isMarked: boolean;
    color?: string;
  children: ReactNode;
} & HTMLMotionProps<'span'>) => (
  <motion.span
       animate={{ color: isMarked ? 'var(--bg)' : color }}
    {...{ transition }}
    {...props}
  >
    {children}
  </motion.span>
);

export default function ChatList({
         user, // from parent * 2
      setUser,
        chats, // from hook   * 12
        error,
     msgState,
    loadState,
      setMsgs,
     isActive,
    isInitial,
    deferring,
  clearAlerts,
       expand,
     collapse,
       isMenu, // optional extra
}: {
        user: User;
     setUser: Auth['setUser'];
} & ChatListener) {
  const { reqHandler } = useFetch<Chat[]>([]);
  const [isDeleting,   setIsDeleting] = useState(false);
  const [showModal,     setShowModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Record<string, boolean>>({});
  const  wasMarked = Object.keys(toBeDeleted).some((key) => toBeDeleted[key]);
  const   navigate = useNavigate();
  const closeModal = () => setShowModal(false);

  const    flex = isActive ? 1 : 0;
  const  cursor = isActive || deferring ? 'auto' : 'pointer';
  const classes = `${css['chat-list']} ${
    isMobile ? css['isMobile'] : ''} ${
      isMenu ? css['isMenu']   : ''
  }`;


  function setDeletedOrActive(chat: Chat, path: string) {
    if (isDeleting) {
      setToBeDeleted((state) => ({ ...state, [chat._id]: !state[chat._id] }));
    } else {
      expand(chat, path);
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
      data = { [isActive._id]: true };
    }

    if (!data) return;

    await reqHandler({ url: 'chat/delete', method: 'DELETE', data });
    if (wasMarked) setToBeDeleted({});
    closeModal();
    setIsDeleting(false);
  }

  function cancelDelete() {
    setIsDeleting(false);
    setToBeDeleted({});
  }

  function navTo(path: string) {
    if (!isActive) return;
    navigate('/user/' + path);
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
            {!isMenu && !isActive?.isTemp && (
              <section className={css['delete-buttons']}>
                <Button
                       color={isDeleting || isActive ?    "var(--bg)" : "var(--fg)"}
                  background={isDeleting || isActive ? "var(--error)" : "var(--box)"}
                     onClick={confirmHandler}
                >
                  {isDeleting || isActive ? 'Delete' : 'Select'} Chat{!isActive ? 's' : ''}
                </Button>
                <AnimatePresence>
                  {isDeleting && (
                    <Button exit={{ opacity }} onClick={cancelDelete}>
                      Cancel
                    </Button>
                  )}
                </AnimatePresence>
              </section>
            )}
            <AnimatePresence mode='popLayout'>
              {!chats.length && !isActive ? (
                <motion.p key='fallback' className={css['fallback']} {...animations}>
                  You haven't started any chats
                </motion.p>
              ) : (
                (isActive ? [isActive] : chats).map((chat, i) => {
                  const { _id, host, guest, lastMsg, alerts } = chat;
                  const   recipient = user._id === host._id ? guest : host;
                  const      sender = lastMsg?.sender === user._id ? 'Me' : recipient.name;
                  const         url = `chat/new-msg/${recipient._id}`;
                  const        path = `/inbox/${recipient._id}`;
                  const    isMarked = toBeDeleted[_id];
                  const           x = 20 * (i % 2 === 0 ? 1 : -1);
                  const borderColor = isMarked ?    'var(--bg)' : 'var(--gray-400)';
                  const  background = isMarked ? 'var(--error)' : `var(--box)`;

                  return (
                    <motion.li
                         layout
                            key={_id}
                      className="floating-box"
                        onClick={() => setDeletedOrActive(chat, path)}
                          style={{ cursor }}
                           exit={{ opacity,     flex, x }}
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
                                user={recipient}
                          transition={transition}
                        />
                        <Span
                          layout
                          {...{ color: 'var(--fg)', isMarked }}
                          onClick={() => navTo(recipient._id)}
                        >
                          {recipient.name} {recipient.surname}
                        </Span>
                        <AnimatePresence mode='wait'>
                          {isActive ? (
                            <Button
                               layout
                                  key='btn'
                                 exit={{ opacity }}
                              onClick={collapse}
                            >
                              Back
                            </Button>
                          ) : (
                            <motion.section layout key={lastMsg.updatedAt} {...animations}>
                              <Span   {...{ isMarked }}>
                                {timeAgo(lastMsg.updatedAt)}
                              </Span>
                              <span>
                                <Span {...{ color: 'var(--accent)', isMarked }}>
                                  {sender}
                                </Span>
                                <Counter count={alerts[user._id]} />
                              </span>
                              <Span   {...{ isMarked }}>
                                {lastMsg.content}
                              </Span>
                            </motion.section>
                          )}
                        </AnimatePresence>
                      </h2>
                      <AnimatePresence>
                        {isActive && (
                          <>
                            <Messages
                              {...{
                                       user,
                                       chat,
                                  loadState,
                                   msgState,
                                    setMsgs,
                                clearAlerts,
                              }}
                            />
                            <SendMessage {...{ setUser, url }} />
                          </>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })
              )}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </AsyncAwait>
    </>
  );
}
