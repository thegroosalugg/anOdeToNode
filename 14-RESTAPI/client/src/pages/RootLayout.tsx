import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <>
      <NavBar />
      <AnimatePresence mode='wait'>
        <motion.main
                  id='main'
                 key={pathname}
                exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </>
  );
}
