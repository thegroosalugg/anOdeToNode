import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import Time from "@/components/ui/tags/Time";
import CloseButton from "@/components/ui/button/CloseButton";
import NameTag from "@/components/ui/tags/NameTag";
import { createAnimations } from "@/lib/motion/animations";
import css from "./ReplyAlerts.module.css";

const animations = createAnimations({ initial: { x: -20 }, animate: { x: 0 } });

export default function ReplyAlerts() {
  const { replies, clearReply, navTo } = useAlerts();

  return (
    <AnimatePresence mode="popLayout">
      {replies.length > 0 ? (
        replies.map(({ _id, creator, content, post, createdAt }) => (
          <motion.li
               layout
                  key={_id}
            className={`floating-box ${css["reply-alert"]}`}
            {...animations}
          >
            <Time time={createdAt} />
            <section>
              <NameTag user={creator} onClick={() => navTo("/user/" + creator._id)} />
              {" replied to your post "}
              <strong onClick={() => navTo("/post/" + post._id)}>{post.title}</strong>
              <p>{content}</p>
            </section>
            <CloseButton onClick={() => clearReply(_id)} />
          </motion.li>
        ))
      ) : (
        <motion.p key="fallback" className={css["fallback"]}>
          No new replies
        </motion.p>
      )}
    </AnimatePresence>
  );
}
