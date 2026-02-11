import { motion } from "motion/react";
import { isLandscapeMobile } from "@/lib/runtime/runtime";
import { circularExpand, verticalWipe } from "@/lib/motion/transitions";
import css from "./FlashTransition.module.css";

export default function FlashTransition({ trigger }: { trigger: React.Key | null | undefined }) {
  const animations = isLandscapeMobile() ? circularExpand : verticalWipe;

  return <motion.div className={css["flash-transition"]} key={trigger} {...animations} />;
}
