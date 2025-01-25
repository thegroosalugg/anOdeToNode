import { Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/navigation/NavBar';
import useFetch, { ReqConfig } from '@/hooks/useFetch';
import { Fetch, FetchError } from '@/util/fetchData';
import User from '@/models/User';
import { captainsLog } from '@/util/captainsLog';

type  isUser =       User | null;
type isError = FetchError | null;

export interface Auth {
       user: isUser;
    setUser: Dispatch<SetStateAction<isUser>>;
    reqUser: (params: Fetch, config?: ReqConfig<isUser>) => Promise<isUser | void>;
  isLoading: boolean;
      error: isError;
   setError: Dispatch<SetStateAction<isError>>;
}

export default function RootLayout({
  children,
}: {
  children: (props: Auth) => ReactNode;
}) {
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
    const mountData = async () => {
      await reqUser({ url: 'user' }, { onError: () => setUser(null) });
      captainsLog(-100, 105, ['ROOT Mount Data']); // **LOGDATA
    };


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
