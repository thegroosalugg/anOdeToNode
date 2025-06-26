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
import { ChatListener } from "@/lib/hooks/useChatListener";
import { createAnimations, createVariants } from "@/lib/motion/animations";

const    opacity = 0;
const transition = { duration: 0.5, ease: "linear" };

const Span = ({
  isMarked,
     color = "var(--text)",
  children,
  ...props
}: {
  isMarked: boolean;
    color?: string;
  children: ReactNode;
} & HTMLMotionProps<"span">) => (
  <motion.span
    animate={{ color: isMarked ? "var(--bg)" : color }}
    {...{ transition }}
    {...props}
  >
    {children}
  </motion.span>
);

interface ChatProps extends Pick<ChatListener, "isActive" | "deferring" | "collapse"> {
          chat: Chat;
          user: User;
      isMarked: boolean;
  expandOrMark: (chat: Chat, path: string) => void;
      children: (recipient: User) => ReactNode;
}

export default function ChatItem({
  chat,
  user,
  isMarked,
  isActive,
  deferring,
  collapse,
  expandOrMark,
  children,
}: ChatProps) {
  const navigate = useNavigate();
  const { _id, host, guest, lastMsg, alerts } = chat;
  const   recipient = user._id === host._id ? guest : host;
  const      sender = lastMsg?.sender === user._id ? "Me" : recipient.name;
  const        path = `/inbox/${recipient._id}`;
  const borderColor = isMarked ?    "var(--bg)" : "var(--text)";
  const  background = isMarked ? "var(--error)" : `var(--box)`;
  const        flex = isActive ? 1 : 0;
  const      cursor = isActive || deferring ? "auto" : "pointer";
  const  animations = createAnimations({ transition: { ease: "linear"}});
  const    variants = createVariants({ initial: { flex }, animate: { flex } });

  function navTo(path: string) {
    if (!isActive) return;
    navigate("/user/" + path);
  }

  return (
    <motion.li
        layout
      className={`floating-box ${css["chat-item"]}`}
        onClick={() => expandOrMark(chat, path)}
          style={{ cursor, background, borderColor }}
           exit={{ ...variants.hidden }}
      {...{ variants, transition }}
    >
      <header>
        <ProfilePic
          layout
          animate={{ borderColor }}
             user={recipient}
          {...{ transition }}
        />
        <Span
          layout
          {...{ color: "var(--fg)", isMarked }}
          onClick={() => navTo(recipient._id)}
        >
          {recipient.name} {recipient.surname}
        </Span>
        <AnimatePresence mode="wait">
          {isActive ? (
            <Button layout key="btn" exit={{ opacity }} onClick={collapse}>
              Back
            </Button>
          ) : (
            <motion.section layout key={lastMsg.updatedAt} {...animations}>
              <Span {...{ isMarked }}>{timeAgo(lastMsg.updatedAt)}</Span>
              <span>
                <Span {...{ color: "var(--accent)", isMarked }}>{sender}</Span>
                <Counter count={alerts[user._id]} />
              </span>
              <Span {...{ isMarked }}>{lastMsg.content}</Span>
            </motion.section>
          )}
        </AnimatePresence>
      </header>
      {children(recipient)}
    </motion.li>
  );
}
