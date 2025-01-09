import { Dispatch, SetStateAction, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import useFetch, { FetchError } from '@/hooks/useFetch';
import User from '@/models/User';

export interface AuthProps {
       user: User | null;
    setData: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
      error: FetchError | null;
 }

export default function RootLayout({
  children,
}: {
  children: (props: AuthProps) => React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { data: user, setData, reqHandler, isLoading, error } = useFetch<User | null>();
  const props = { user, setData, isLoading, error };

  useEffect(() => {
    const mountData = async () => await reqHandler({ url: 'user' });
    console.log('ROOT LAYOUT');

    mountData();
  }, [reqHandler, pathname]);

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
    </>
  );
}
