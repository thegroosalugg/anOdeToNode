import { motion } from "motion/react";
import { useChat } from "../context/ChatContext";
import AsyncAwait from "../../ui/boundary/AsyncAwait";
import ChatActions from "./actions/ChatActions";
import ChatList from "./list/ChatList";
import { createAnimations } from "@/lib/motion/animations";
import css from "./ChatBody.module.css";

export default function ChatBody() {
  const { isLoading, error, chats, activeChat } = useChat();

  return (
    <div className={css["chat-body"]}>
      <AsyncAwait {...{ isLoading, error }}>
        <ChatActions />
        {!chats.length && !activeChat ? (
          <motion.h2 className={css["fallback"]} {...createAnimations()}>
            You haven't started any chats
          </motion.h2>
        ) : (
          <ChatList />
        )}
      </AsyncAwait>
    </div>
  );
}
