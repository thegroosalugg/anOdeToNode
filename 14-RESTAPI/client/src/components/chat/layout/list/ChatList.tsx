import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useChat } from "../../context/ChatContext";
import { api } from "@/lib/http/endpoints";
import ChatItem from "./ChatItem";
import Messages from "../messages/Messages";
import ChatBox from "@/components/form/primitives/ChatBox";
import css from "./ChatList.module.css";

export default function ChatList() {
  const { chats, activeChat } = useChat();

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
                    <ChatBox {...{ url: api.chat.newMsg(recipient._id), animations: { transition: { delay: 1 } } }} />
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
