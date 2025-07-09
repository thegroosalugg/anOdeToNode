import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import Time from "@/components/ui/tags/Time";
import XButton from "@/components/ui/button/XButton";
import NameTag from "@/components/ui/tags/NameTag";
import Heading from "@/components/ui/layout/Heading";
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
            <XButton onClick={() => clearReply(_id)} />
          </motion.li>
        ))
      ) : (
        <motion.li key="fallback" style={{ textAlign: "center" }}>
          <Heading>No new replies</Heading>
        </motion.li>
      )}
    </AnimatePresence>
  );
}
