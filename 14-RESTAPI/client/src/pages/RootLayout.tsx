import { Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import useFetch from '@/hooks/useFetch';
import { Fetch, FetchError } from '@/util/fetchData';
import User from '@/models/User';
import { captainsLog } from '@/util/captainsLog';

export interface AuthProps {
        user: User | null;
     setUser: Dispatch<SetStateAction<User | null>>;
     reqUser: (params: Fetch, cb?: () => void) => Promise<Record<string, string>>;
   isLoading: boolean;
       error: FetchError | null;
    setError: Dispatch<SetStateAction<FetchError | null>>;
}

export default function RootLayout({
  children,
}: {
  children: (props: AuthProps) => ReactNode;
}) {
  const { pathname } = useLocation();
  const {
          data: user,
       setData: setUser,
    reqHandler: reqUser,
     isLoading,
         error,
      setError,
  } = useFetch<User | null>();
  const props = { user, setUser, reqUser, isLoading, error, setError };

  useEffect(() => {                                                 // callback on Error
    const mountData = async () => await reqUser({ url: 'user' }, () => setUser(null));
    captainsLog(-100, 105, ['ROOT Mount Data']); // **LOGDATA
    mountData();
  }, [reqUser, setUser, pathname]);

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
