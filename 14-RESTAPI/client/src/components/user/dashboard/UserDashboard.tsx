import { ReactNode } from "react";
import { motion } from "motion/react";
import { UserPair } from "@/lib/types/interface";
import Friend from "@/models/Friend";
import UserItem from "@/components/list/user/UserItem";
import UserAbout from "./UserAbout";
import { createAnimations } from "@/lib/motion/animations";
import css from "./UserDashboard.module.css";

interface UserDashboard extends UserPair {
   children: ReactNode;
}

const animations = createAnimations();

// watcher is always you and always defined as routes are protected by if (!user)
export default function UserDashboard({ target, watcher, children }: UserDashboard) {
  let classes = css["user-dashboard"];
  let acceptedAt;
  if (watcher) acceptedAt = Friend.getConnection(target, watcher)?.acceptedAt;
  else classes += ` ${css["reverse"]}`;

  return (
    <motion.article className={classes} {...animations}>
      <section>
        <UserItem
          className={css["user-photo"]}
             {...{ target, watcher }}
               font="line-clamp"
        />
        {children}
      </section>
      <UserAbout {...{ target, watcher, acceptedAt }} />
    </motion.article>
  );
}
