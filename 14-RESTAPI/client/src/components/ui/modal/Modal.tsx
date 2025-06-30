import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import Backdrop from "./Backdrop";
import { createAnimations } from "@/lib/motion/animations";

export default function Modal({
  children,
      open,
     close,
}: {
  children: React.ReactNode;
      open: boolean;
     close: () => void;
}) {
  const    initial = { y: -50 };
  const    animate = { y:   0 };
  const animations = createAnimations({ initial, animate });

  const Element = (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop isOpen onClick={close} zIndex={25} />
          <motion.dialog
            open
            {...animations}
            className={css["modal"]}
                style={{ translate: "-50% -50%" }} // centers modal. Set inline due to framer's y
          >
            {children}
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(Element, document.getElementById("modal-root")!);
}
