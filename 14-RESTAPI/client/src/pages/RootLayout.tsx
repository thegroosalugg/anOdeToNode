import { Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import useFetch, { FetchError } from '@/hooks/useFetch';
import User from '@/models/User';
import { captainsLog } from '@/util/captainsLog';

export interface AuthProps {
       user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
      error: FetchError | null;
 }

export default function RootLayout({
  children,
}: {
  children: (props: AuthProps) => ReactNode;
}) {
  const { pathname } = useLocation();
  const { data: user, setData: setUser, reqHandler, isLoading, error } = useFetch<User | null>();
  const props = { user, setUser, isLoading, error };

  useEffect(() => {
    const mountData = async () => await reqHandler({ url: 'user' });

    captainsLog(-100, 105, ['ROOT Mount Data']); // **LOGDATA
    mountData();
  }, [reqHandler, pathname]);

  captainsLog(105, -90, ['ROOT RENDER CYCLE user', user]); // **LOGDATA

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
