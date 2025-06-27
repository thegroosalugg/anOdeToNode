import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Messages from "../messages/Messages";
import SendMessage from "../../../form/SendMessage";
import css from "./ChatList.module.css";
import ChatItem from "./ChatItem";
import { useChat } from "../../context/ChatContext";
import Chat from "@/models/Chat";

interface ListProps {
        marked: Record<string, boolean>;
  expandOrMark: (chat: Chat, path: string) => void;
}

export default function ChatList({ marked, expandOrMark }: ListProps) {
  const { setUser, chats, isActive } = useChat();
  const sendTo = (path: string) => `chat/new-msg/${path}`;

  return (
    <LayoutGroup>
      <motion.ul className={css["chat-list"]} initial="hidden" animate="visible">
        <AnimatePresence>
          {(isActive ? [isActive] : chats).map((chat) => (
            <ChatItem key={chat._id} {...{ chat, expandOrMark, isMarked: marked[chat._id] }}>
              {(recipient) => (
                <AnimatePresence>
                  {isActive && (
                    <>
                      <Messages {...{ chat }} />
                      <SendMessage {...{ setUser, url: sendTo(recipient._id) }} />
                    </>
                  )}
                </AnimatePresence>
              )}
            </ChatItem>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
