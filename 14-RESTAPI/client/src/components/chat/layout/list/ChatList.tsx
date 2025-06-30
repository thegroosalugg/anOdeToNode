import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useChat } from "../../context/ChatContext";
import ChatItem from "./ChatItem";
import Messages from "../messages/Messages";
import ChatBox from "@/components/form/ChatBox";
import css from "./ChatList.module.css";

export default function ChatList() {
  const { setUser, chats, activeChat } = useChat();
  const sendTo = (path: string) => `chat/new-msg/${path}`;

  return (
    <motion.ul
       className={css["chat-list"]}
         initial="hidden"
         animate="visible"
      transition={{ staggerChildren: 0.2 }} // applies when you load app with chat URL
    >
      <LayoutGroup>
        <AnimatePresence>
          {(activeChat ? [activeChat] : chats).map((chat) => (
            <ChatItem key={chat._id} {...{ chat }}>
              {(recipient) =>
                activeChat && (
                  <>
                    <Messages {...{ chat }} />
                    <ChatBox {...{ setUser, url: sendTo(recipient._id) }} />
                  </>
                )
              }
            </ChatItem>
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </motion.ul>
  );
}
