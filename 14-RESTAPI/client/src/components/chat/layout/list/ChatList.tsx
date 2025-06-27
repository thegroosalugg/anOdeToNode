import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Messages from "../messages/Messages";
import SendMessage from "../../../form/SendMessage";
import css from "./ChatList.module.css";
import ChatItem from "./ChatItem";
import { createAnimations } from "@/lib/motion/animations";
import { useChat } from "../../context/ChatContext";
import Chat from "@/models/Chat";

interface ListProps {
        marked: Record<string, boolean>;
  expandOrMark: (chat: Chat, path: string) => void;
}

export default function ChatList({ marked, expandOrMark }: ListProps) {
  const { setUser, chats, isActive } = useChat();
  const animations = createAnimations({ transition: { delay: 0.5 } });

  return (
    <LayoutGroup>
      <motion.ul
        className={css["chat-list"]}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.03 }}
      >
        <AnimatePresence>
          {!chats.length && !isActive ? (
            <motion.h2 key="fallback" className={css["fallback"]} {...animations}>
              You haven't started any chats
            </motion.h2>
          ) : (
            (isActive ? [isActive] : chats).map((chat) => (
              <ChatItem
                key={chat._id}
                {...{ chat, expandOrMark, isMarked: marked[chat._id] }}
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
  );
}
