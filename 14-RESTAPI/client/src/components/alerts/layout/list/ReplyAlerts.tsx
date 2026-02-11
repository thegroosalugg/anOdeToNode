import { AnimatePresence, motion } from "motion/react";
import { useAlerts } from "../../context/AlertsContext";
import Time from "@/components/ui/tags/Time";
import XButton from "@/components/ui/button/XButton";
import NameTag from "@/components/ui/tags/NameTag";
import Heading from "@/components/ui/layout/Heading";
import { createAnimations } from "@/lib/motion/animations";
import { ROUTES } from "@/routes/paths";
import css from "./ReplyAlerts.module.css";
import shared from "./Shared.module.css";

const animations = createAnimations({ initial: { x: -20 }, animate: { x: 0 } });
const { toUser, toPost } = ROUTES;

export default function ReplyAlerts() {
  const { replies, clearReply, navTo } = useAlerts();

  return (
    <AnimatePresence mode="popLayout">
      {replies.length > 0 ? (
        replies.map(({ _id, creator, content, post, createdAt }) => (
          <motion.li
               layout
                  key={_id}
            className={`box ${shared["alert"]}`}
            {...animations}
          >
            <Time time={createdAt} />
            <div>
              <div className={shared["content"]}>
                <NameTag user={creator} align="center" overflow="line-clamp">
                  <strong onClick={() => navTo(toUser(creator._id))}>
                    {creator.name}
                  </strong>
                  {" replied to your post "}
                  <strong
                    className={`truncate ${css["post"]}`}
                      onClick={() => navTo(toPost(post._id))}
                  >
                    {post.title}
                  </strong>
                </NameTag>
                <XButton onClick={() => clearReply(_id)} />
              </div>
              <p className={`truncate ${css["reply"]}`}>{content}</p>
            </div>
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
