import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

export default function Modal({
  children,
      show,
     close,
}: {
  children: React.ReactNode;
      show: boolean;
     close: () => void;
}) {
  return createPortal(
    <AnimatePresence>
      {show && (
        <>
          <motion.div
             className={css.backdrop}
               onClick={close}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
            whileHover={{ backgroundColor: 'rgba(10, 10, 10, 0.55)' }}
            transition={{ duration: 0.5 }}
          />
          <motion.dialog
                  open
             className={css.modal}
                 style={{ translate: '-50% -50%' }} // centers modal
               initial={{   y: -50, opacity: 0   }}
               animate={{   y:   0, opacity: 1   }}
                  exit={{   y: -50, opacity: 0   }}
            transition={{      duration: 0.3     }}
          >
            {children}
          </motion.dialog>
        </>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')!
  );
}
