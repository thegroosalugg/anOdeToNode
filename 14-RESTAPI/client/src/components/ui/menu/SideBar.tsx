import { motion } from "motion/react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./SideBar.module.css";
import { createAnimations } from "@/lib/motion/animations";
import Backdrop from "../modal/Backdrop";

export default function SideBar({
      open,
     close,
  children,
}: {
      open: boolean;
     close: () => void;
  children: ReactNode;
}) {
  const    animate = { translateX: open ? 0 : "100%" };
  const animations = createAnimations({ animate });

  const Element = (
    <>
      <Backdrop {...{ open }} onClick={close} smHidden />
      <motion.dialog
        {...animations}
        className={css["side-bar"]}
      >
        {children}
      </motion.dialog>
    </>
  );

  return createPortal(Element, document.getElementById("modal-root")!);
}
