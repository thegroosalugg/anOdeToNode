import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import Backdrop from "./Backdrop";
import { createAnimations } from "@/lib/motion/animations";

const initial = { y: -50 };
const animate = { y:   0 };
const animations = createAnimations({ initial, animate });

export default function Modal({
  children,
      open,
     close,
}: {
  children: React.ReactNode;
      open: boolean;
     close: () => void;
}) {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const Element = (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop open onClick={close} zIndex={25} />
          <motion.dialog open {...animations} className={css["modal"]}>
            {children}
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(Element, modalRoot);
}
