import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { ReactNode } from "react";
import { useChat } from "../../context/ChatContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import User from "@/models/User";
import Chat from "@/models/Chat";
import ProfilePic from "@/components/ui/image/ProfilePic";
import Button from "@/components/ui/button/Button";
import Counter from "@/components/ui/counter/Counter";
import { timeAgo } from "@/lib/util/timeStamps";
import { createAnimations, createVariants } from "@/lib/motion/animations";
import css from "./ChatItem.module.css";

type TruncateSpan = { children: ReactNode } & HTMLMotionProps<"span">;

const Truncate = ({ children, ...props }: TruncateSpan) => (
  <motion.span className="truncate" {...props}>
    {children}
  </motion.span>
);

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
        <ProfilePic layout user={recipient} />
        <Truncate layout onClick={() => navTo(recipient._id)}>
          {recipient.name} {recipient.surname}
        </Truncate>
        <AnimatePresence mode="wait">
          {activeChat ? (
            <Button layout key="btn" exit={{ opacity: 0 }} onClick={collapse}>
              Back
            </Button>
          ) : (
            <motion.p layout key={lastMsg.updatedAt} {...animations}>
              <Truncate>{timeAgo(lastMsg.updatedAt)}</Truncate>
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
