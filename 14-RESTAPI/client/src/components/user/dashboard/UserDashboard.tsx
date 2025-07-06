import { ReactNode } from "react";
import { motion } from "motion/react";
import User from "@/models/User";
import UserItem from "@/components/list/user/UserItem";
import UserAbout from "./UserAbout";
import css from "./UserDashboard.module.css";
import Friend from "@/models/Friend";
import { createAnimations } from "@/lib/motion/animations";

interface UserDashboard {
      user: User;
      peer: User;
  children: ReactNode;
}

const animations = createAnimations();

export default function UserDashboard({ user, peer, children }: UserDashboard) {
  const { acceptedAt } = Friend.getConnection(user, peer) ?? {};

  return (
    <motion.article className={css["user-dashboard"]} {...animations}>
      <section>
        <UserItem
          className={css["user-photo"]}
             target={peer}
            watcher={user}
               font="line-clamp"
        />
        {children}
      </section>
      <UserAbout {...{ user, acceptedAt }} />
    </motion.article>
  );
}
