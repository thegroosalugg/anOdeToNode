import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useChat } from "../../context/ChatContext";
import ChatItem from "./ChatItem";
import Messages from "../messages/Messages";
import SendMessage from "../../../form/SendMessage";
import css from "./ChatList.module.css";

export default function ChatList() {
  const { setUser, chats, isActive } = useChat();
  const sendTo = (path: string) => `chat/new-msg/${path}`;

  return (
    <LayoutGroup>
      <motion.ul className={css["chat-list"]} initial="hidden" animate="visible">
        <AnimatePresence>
          {(isActive ? [isActive] : chats).map((chat) => (
            <ChatItem key={chat._id} {...{ chat }}>
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
