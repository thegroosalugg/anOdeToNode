import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/http/fetchData";
import { api } from "@/lib/http/endpoints";
import User from "@/models/User";
import Post from "@/models/Post";
import Button from "../ui/button/Button";
import ChatBox from "../form/primitives/ChatBox";
import NameTag from "../ui/tags/NameTag";
import Time from "../ui/tags/Time";
import Truncate from "../ui/tags/Truncate";
import ResizeDiv from "../ui/layout/ResizeDiv";
import { createVariants } from "@/lib/motion/animations";
import css from "./PostContent.module.css";

const fallback = "/not-found.png";
const variants = createVariants();
const bodyVariants = createVariants({ transition: { staggerChildren: 0.3 } });

export default function PostContent({
      post,
      user,
  setModal,
  callback = () => console.log('on animation complete!'),
}: {
       user: User;
       post: Post;
   setModal: (modal: string) => void;
  callback?: () => void;
}) {
  const { title, content, imgURL, creator, updatedAt } = post;
  const navigate = useNavigate();
  const isCreator = user._id === creator?._id;

  return (
    <motion.section
       className={css["post-content"]}
         initial="hidden"
         animate="visible"
      transition={{ staggerChildren: 0.5 }}
      onAnimationComplete={callback}
    >
      <NameTag user={creator} onClick={() => navigate("/user/" + creator._id)} bold align="end" {...{ variants }} />

      <AnimatePresence mode="wait">
        <motion.div
          className={`box ${css["post-body"]}`}
           variants={bodyVariants}
              style={{ marginBottom: imgURL ? "" : "1rem" }}
        >
          <motion.h2 key={title} {...{ variants }}>
            <Truncate className="underline">{title}</Truncate>
            <Time time={updatedAt} />
          </motion.h2>
          <ResizeDiv className={css["content"]} {...{ variants }}>
            {content}
          </ResizeDiv>
          {isCreator && (
            <motion.div className={css["actions"]} {...{ variants }}>
              <Button onClick={() => setModal("edit")}>Edit</Button>
              <Button onClick={() => setModal("delete")} background="danger">
                Delete
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {imgURL && (
          <motion.div className={`box ${css["image"]}`} {...{ variants }}>
            <motion.img
                  key={imgURL}
                  src={API_URL + imgURL}
                  alt={title}
              loading="eager"
                 exit={variants.hidden}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallback;
                (e.target as HTMLImageElement).style.boxShadow = "none";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatBox {...{ url: api.post.reply(post._id), variants }} />
    </motion.section>
  );
}
