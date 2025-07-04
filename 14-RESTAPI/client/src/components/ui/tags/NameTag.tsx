import { HTMLMotionProps, motion } from "motion/react";
import User from "@/models/User";
import ProfilePic from "../image/ProfilePic";
import css from "./NameTag.module.css";
import { Align } from "@/lib/types/common";
import Truncate from "./Truncate";

interface NameTag extends HTMLMotionProps<"h2"> {
      user: User;
     bold?: boolean,
  reverse?: boolean;
    align?: Align;
}

export default function NameTag({
     user,
     bold,
  reverse,
    align,
  ...props
}: NameTag) {
  const { name = "account", surname = "deleted" } = user;
  let classes = css["name-tag"];
  if  (bold)   classes += ` ${css["bold"]}`;
  if (reverse) classes += ` ${css["reverse"]}`;
  if  (align)  classes += ` ${css[align]}`;

  return (
    <motion.h2 className={classes} {...props}>
      <ProfilePic {...{ user }} />
      <Truncate>
        {name} {surname}
      </Truncate>
    </motion.h2>
  );
}
