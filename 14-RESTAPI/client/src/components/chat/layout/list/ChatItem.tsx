import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";
import { useChat } from "../../context/ChatContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import User from "@/models/User";
import Chat from "@/models/Chat";
import Button from "@/components/ui/button/Button";
import Counter from "@/components/ui/tags/Counter";
import { createAnimations, createVariants } from "@/lib/motion/animations";
import NameTag from "@/components/ui/tags/NameTag";
import Time from "@/components/ui/tags/Time";
import css from "./ChatItem.module.css";
import Truncate from "@/components/ui/tags/Truncate";

interface ChatProps {
      chat: Chat;
  children: (recipient: User) => ReactNode;
}

export default function ChatItem({ chat, children }: ChatProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, deferring, activeChat, collapse, markedMap, expandOrMark } = useChat();

  const { host, guest, lastMsg, alerts } = chat;
  const   recipient = user._id === host._id ? guest : host;
  const      sender = lastMsg?.sender === user._id ? "Me" : recipient.name;
  const        flex = activeChat ? 1 : 0;
  const      cursor = activeChat || deferring ? "auto" : "pointer";
  const  animations = createAnimations({ transition: { ease: "linear" }});
  const    variants = createVariants({ initial: { flex: 0 }, animate: { flex } });
  let       classes = `floating-box ${css["chat-item"]} `;
  if (markedMap[chat._id]) classes += css["marked"];

  function navTo(path: string) {
    if (!activeChat) return;
    navigate({
      pathname: `/user/${path}`,
        search: searchParams.toString(),
    });
  }

  return (
    <motion.li
        layout
      className={classes}
        onClick={() => expandOrMark(chat, recipient._id)}
          style={{ cursor }}
           exit={{ ...variants.hidden, x: -10 }}
      {...{ variants }}
    >
      <header style={{ boxShadow: activeChat ? "var(--shadow-sm)" : ""}}>
        <NameTag
          layout
             user={recipient}
            align="center"
          onClick={() => navTo(recipient._id)}
        />
        <AnimatePresence mode="wait">
          {activeChat ? (
            <Button layout key="btn" exit={{ opacity: 0 }} onClick={collapse}>
              Back
            </Button>
          ) : (
            <motion.p layout key={lastMsg.updatedAt} {...animations}>
              <Time time={lastMsg.updatedAt} />
              <span className={css["counter"]}>
                <Truncate>{sender}</Truncate>
                <Counter count={alerts[user._id]} />
              </span>
              <Truncate>{lastMsg.content}</Truncate>
            </motion.p>
          )}
        </AnimatePresence>
      </header>
      {children(recipient)}
    </motion.li>
  );
}
