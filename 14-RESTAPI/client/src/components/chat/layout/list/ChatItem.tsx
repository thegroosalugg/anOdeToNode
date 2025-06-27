import Chat from "@/models/Chat";
import css from "./ChatItem.module.css";
import User from "@/models/User";
import ProfilePic from "@/components/ui/image/ProfilePic";
import { ReactNode } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button/Button";
import { timeAgo } from "@/lib/util/timeStamps";
import Counter from "@/components/notifications/Counter";
import { createAnimations, createVariants } from "@/lib/motion/animations";
import { useChat } from "../../context/ChatContext";

type TruncateSpan = { children: ReactNode } & HTMLMotionProps<"span">;

const Truncate = ({ children, ...props }: TruncateSpan) => (
  <motion.span className="truncate" {...props}>
    {children}
  </motion.span>
);

interface ChatProps {
          chat: Chat;
      isMarked: boolean;
  expandOrMark: (chat: Chat, path: string) => void;
      children: (recipient: User) => ReactNode;
}

export default function ChatItem({
          chat,
      isMarked,
  expandOrMark,
      children,
}: ChatProps) {
  const navigate = useNavigate();
  const { user, deferring, isActive, collapse } = useChat();
  const { host, guest, lastMsg, alerts } = chat;
  const   recipient = user._id === host._id ? guest : host;
  const      sender = lastMsg?.sender === user._id ? "Me" : recipient.name;
  const        flex = isActive ? 1 : 0;
  const      cursor = isActive || deferring ? "auto" : "pointer";
  const  animations = createAnimations({ transition: { ease: "linear"}});
  const    variants = createVariants({ initial: { flex }, animate: { flex } });
  const     classes = `floating-box ${css["chat-item"]} ${isMarked ? css["marked"] : ""}`;

  function navTo(path: string) {
    if (!isActive) return;
    navigate("/user/" + path);
  }

  return (
    <motion.li
        layout
      className={classes}
        onClick={() => expandOrMark(chat, recipient._id)}
          style={{ cursor }}
           exit={{ ...variants.hidden }}
      {...{ variants }}
    >
      <header>
        <ProfilePic layout user={recipient} />
        <Truncate layout onClick={() => navTo(recipient._id)}>
          {recipient.name} {recipient.surname}
        </Truncate>
        <AnimatePresence mode="wait">
          {isActive ? (
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
