import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import css from './PortalMenu.module.css';

export default function PortalMenu({
      show,
     close,
  children,
}: {
      show: boolean | string;
     close: () => void;
  children: ReactNode;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      close();
    }
  }, [close]);

  const animation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
       exit: { opacity: 0 },
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [closeMenu]);

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.section className={css['menu']} {...animation} ref={menuRef}>
          {children}
        </motion.section>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root')!
  );
}
