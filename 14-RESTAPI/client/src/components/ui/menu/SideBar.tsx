import { motion } from "motion/react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./SideBar.module.css";
import { createAnimations } from "@/lib/motion/animations";
import Backdrop from "../modal/Backdrop";

export default function SideBar({
      open,
     close,
   onRight,
  children,
}: {
      open: boolean;
     close: () => void;
  onRight?: boolean;
  children: ReactNode;
}) {
  const dir = onRight ? "100%" : "-100%";
  const    initial = { translateX: dir };
  const    animate = { translateX: open ? 0 : dir };
  const animations = createAnimations({ initial, animate });
  let classes = css["side-bar"];
  if (onRight) classes += ` ${css["on-right"]}`;

  const Element = (
    <>
      <Backdrop {...{ open }} onClick={close} shouldHide />
      <motion.dialog
        {...animations}
        className={classes}
      >
        {children}
      </motion.dialog>
    </>
  );

  const root = document.getElementById("root");
  if (!root) return null;
  
  return createPortal(Element, root);
}
