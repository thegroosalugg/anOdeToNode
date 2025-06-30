import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { useFetch } from "@/lib/hooks/useFetch";
import { useDepedencyTracker } from "@/lib/hooks/useDepedencyTracker";
import Chat from "@/models/Chat";
import Msg from "@/models/Message";
import AsyncAwait from "../../../ui/boundary/AsyncAwait";
import { formatDate } from "@/lib/util/timeStamps";
import { createVariants } from "@/lib/motion/animations";
import css from "./Messages.module.css";

export default function Messages({ chat }: { chat: Chat }) {
  const { user, msgsMap, loadedMap, setMsgs, setLoaded, clearAlerts } = useChat();
  const { reqData, isLoading, error } = useFetch<Msg[]>([]);
  const      msgs =   msgsMap[chat._id] || [];
  const hasLoaded = loadedMap[chat._id];
  const  noAlerts = chat.alerts[user._id] <= 0;
  const    msgRef = useRef<HTMLParagraphElement>(null);
  const  scrollTo = () => msgRef.current?.scrollIntoView({ behavior: "smooth" });
  const  variants = createVariants();

  useDepedencyTracker("chat", {
       reqUser: user._id,
        chatId: chat._id,
    chatAlerts: chat.alerts,
    chatIsTemp: chat.isTemp,
     loadedMap,
     hasLoaded,
      noAlerts,
  });

  useEffect(() => {
    if (chat.isTemp || noAlerts) return;
    clearAlerts(chat._id);
  }, [chat._id, chat.isTemp, noAlerts, clearAlerts]);

  useEffect(() => {
    if (chat.isTemp || hasLoaded) return;

    reqData(
      { url: `chat/messages/${chat._id}` },
      {
        onSuccess: (msgs) => {
            setMsgs((state) => ({ ...state, [chat._id]: msgs }));
          setLoaded((state) => ({ ...state, [chat._id]: true }));
        },
      }
    );
  }, [chat._id, chat.isTemp, hasLoaded, loadedMap, reqData, setMsgs, setLoaded]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      <motion.ul
         className={css["messages"]}
           initial="hidden"
           animate="visible"
        transition={{
                 duration: 0.5,
                     ease: "easeOut",
            delayChildren: 0.2,
          staggerChildren: msgs.length < 20 ? 0.1 : 0,
        }}
      >
        {msgs.map((msg, i) => {
          const { _id, createdAt, sender, content } = msg;
          const isLast = i === msgs.length - 1;

          return (
            <motion.li
              key={_id}
              layout
              {...{ variants }}
              className={user._id === sender ? css["sender"] : ""}
              onAnimationComplete={scrollTo}
            >
              <time>{formatDate(createdAt, ["weekday", "time"])}</time>
              <p ref={isLast ? msgRef : null}>{content}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </AsyncAwait>
  );
}
