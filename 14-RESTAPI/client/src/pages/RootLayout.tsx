import { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/layout/header/NavBar';
import Footer from '@/components/layout/footer/Footer';
import useFetch from '@/lib/hooks/useFetch';
import { Auth } from '@/lib/types/auth';

export default function RootLayout({ children }: { children: (props: Auth) => ReactNode }) {
  const { pathname } = useLocation();
  const {
          data: user,
       setData: setUser,
    reqHandler: reqUser,
     isLoading,
         error,
      setError,
  } = useFetch<Auth['user']>(null, true); // null initial, true loading before useEffect
  const props = { user, setUser, reqUser, isLoading, error, setError };

  useEffect(() => {
    reqUser({ url: 'user' }, { onError: () => setUser(null) });
  }, [reqUser, setUser]);

  return (
    <>
      <NavBar {...props} />
      <AnimatePresence mode='wait'>
        <motion.main
                  id='main'
                 key={pathname}
                exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children(props)}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}
