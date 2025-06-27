import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import useFetch from "@/lib/hooks/useFetch";
import Chat from "@/models/Chat";
import Modal from "../../ui/modal/Modal";
import ConfirmDialog from "../../ui/modal/ConfirmDialog";
import Button from "../../ui/button/Button";
import Messages from "../messages/Messages";
import SendMessage from "../../form/SendMessage";
import AsyncAwait from "../../ui/boundary/AsyncAwait";
import css from "./ChatList.module.css";
import ChatItem from "./ChatItem";
import { createAnimations } from "@/lib/motion/animations";
import { useChat } from "../context/ChatContext";

export default function ChatList() {
  const { setUser, chats, error, isActive, isInitial, expand } = useChat();
  const {       reqHandler      } = useFetch<Chat[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [marked,       setMarked] = useState<Record<string, boolean>>({});
  const  wasMarked = Object.keys(marked).some((key) => marked[key]);
  const closeModal = () => setShowModal(false);
  const  animations = createAnimations({ transition: { delay: 0.5 }});

  function expandOrMark(chat: Chat, path: string) {
    if (isMarking) {
      setMarked((state) => ({ ...state, [chat._id]: !state[chat._id] }));
    } else {
      expand(chat, path);
    }
  }

  function confirmHandler() {
    if ((isMarking && wasMarked) || isActive) {
      setShowModal(true);
    } else {
      setIsMarking(true);
    }
  }

  async function deleteHandler() {
    if (!(isMarking || isActive)) return;

    let data;
    if (wasMarked) {
      data = Object.fromEntries(Object.entries(marked).filter(([_, v]) => v));
    } else if (isActive) {
      data = { [isActive._id]: true };
    }

    if (!data) return;

    await reqHandler({ url: "chat/delete", method: "DELETE", data });
    if (wasMarked) setMarked({});
    closeModal();
    setIsMarking(false);
  }

  function cancelDelete() {
    setIsMarking(false);
    setMarked({});
  }

  return (
    <>
      <Modal show={showModal} close={closeModal}>
        <ConfirmDialog onCancel={closeModal} onConfirm={deleteHandler} />
      </Modal>
      <AsyncAwait {...{ isLoading: isInitial, error }}>
        <LayoutGroup>
          <motion.ul
             className={css["chat-list"]}
               initial="hidden"
               animate="visible"
            transition={{ staggerChildren: 0.03 }}
          >
            {!isActive?.isTemp && (
              <section className={css["delete-buttons"]}>
                <Button
                       color={isMarking || isActive ?    "var(--bg)" : "var(--fg)"}
                  background={isMarking || isActive ? "var(--error)" : "var(--box)"}
                     onClick={confirmHandler}
                >
                  {isMarking || isActive ? "Delete" : "Select"} Chat{!isActive ? "s" : ""}
                </Button>
                <AnimatePresence>
                  {isMarking && (
                    <Button exit={{ opacity: 0 }} onClick={cancelDelete}>
                      Cancel
                    </Button>
                  )}
                </AnimatePresence>
              </section>
            )}
            <AnimatePresence>
              {!chats.length && !isActive ? (
                <motion.h2 key="fallback" className={css["fallback"]} {...animations}>
                  You haven't started any chats
                </motion.h2>
              ) : (
                (isActive ? [isActive] : chats).map((chat) => (
                  <ChatItem
                    key={chat._id}
                    {...{
                      chat,
                      isMarked: marked[chat._id],
                      expandOrMark,
                    }}
                  >
                    {(recipient) => (
                      <AnimatePresence>
                        {isActive && (
                          <>
                            <Messages {...{ chat }} />
                            <SendMessage
                              {...{ setUser, url: `chat/new-msg/${recipient._id}` }}
                            />
                          </>
                        )}
                      </AnimatePresence>
                    )}
                  </ChatItem>
                ))
              )}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </AsyncAwait>
    </>
  );
}
