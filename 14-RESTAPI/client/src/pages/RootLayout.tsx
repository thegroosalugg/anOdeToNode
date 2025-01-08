import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';

export default function RootLayout({
  children,
}: {
  children: (user: User | null) => React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { data, reqHandler } = useFetch<User>();

  useEffect(() => {
    const mountData = async () => await reqHandler({ url: 'user' });
    console.log('ROOT LAYOUT');

    mountData();
  }, [reqHandler, pathname]);

  return (
    <>
      <NavBar user={data} />
      <AnimatePresence mode='wait'>
        <motion.main
                  id='main'
                 key={pathname}
                exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {children(data)}
        </motion.main>
      </AnimatePresence>
    </>
  );
}
