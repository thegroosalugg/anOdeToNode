import { timeAgo } from "@/lib/util/timeStamps";
import { HTMLMotionProps, motion } from "motion/react";
import css from "./Time.module.css";

export default function Time({ time }: { time: string } & HTMLMotionProps<"time">) {
  return <motion.time className={`${css["time"]} truncate`}>{timeAgo(time)}</motion.time>;
}
