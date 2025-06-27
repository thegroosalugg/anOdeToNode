import { motion } from "motion/react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./SideBar.module.css";
import { createAnimations } from "@/lib/motion/animations";
import Backdrop from "../modal/Backdrop";

export default function SideBar({
    isOpen,
     close,
  children,
}: {
    isOpen: boolean;
     close: () => void;
  children: ReactNode;
}) {
  const    initial = { translateX: "100%" };
  const    animate = { translateX: isOpen ? 0 : "100%" };
  const animations = createAnimations({ initial, animate });

  const Element = (
    <>
      <Backdrop {...{ isOpen }} onClick={close} smHidden />
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
