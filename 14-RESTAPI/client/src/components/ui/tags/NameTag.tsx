import { HTMLMotionProps, motion } from "motion/react";
import { ReactNode } from "react";
import { Align } from "@/lib/types/common";
import User from "@/models/User";
import ProfilePic from "../image/ProfilePic";
import css from "./NameTag.module.css";

interface NameTag extends HTMLMotionProps<"h2"> {
       user: User;
  children?: ReactNode;
      bold?: boolean,
   reverse?: boolean;
     align?: Align;
  overflow?: "truncate" | "line-clamp";
  tagProps?: HTMLMotionProps<"span">;
}

export default function NameTag({
      user,
  children = null,
      bold,
   reverse,
     align,
  overflow = "truncate",
  tagProps = {},
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
      <motion.span {...tagProps} className={overflow}>
        <span className={css["name"]}>
          {name} {surname}
        </span>
        {children}
      </motion.span>
    </motion.h2>
  );
}
