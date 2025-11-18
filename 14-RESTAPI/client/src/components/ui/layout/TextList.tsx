import { motion } from "motion/react";
import { createVariants } from "@/lib/motion/animations";
import css from "./TextList.module.css";

const variants = createVariants();

export default function TextList({
     items,
  children,
}: {
     items: string[];
  children: React.ReactNode;
}) {
  return (
    <>
      <motion.h2 className={css["header"]} {...{ variants }}>{children}</motion.h2>
      <motion.ul className={css["list"]}   {...{ variants }}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </motion.ul>
    </>
  );
}
