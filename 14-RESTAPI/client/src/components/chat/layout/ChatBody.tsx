import { motion } from "motion/react";
import AsyncAwait from "../../ui/boundary/AsyncAwait";
import ChatActions from "./actions/ChatActions";
import ChatList from "./list/ChatList";
import { createAnimations } from "@/lib/motion/animations";
import css from "./ChatBody.module.css";
import { useChat } from "../context/ChatContext";

export default function ChatBody() {
  const { isInitial, error, chats, isActive } = useChat();

  return (
    <div className={css["chat-body"]}>
      <AsyncAwait {...{ isLoading: isInitial, error }}>
        <ChatActions />
        {!chats.length && !isActive ? (
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
