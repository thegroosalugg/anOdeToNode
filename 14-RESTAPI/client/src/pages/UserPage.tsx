import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Auth } from './RootLayout';
import Loader from '@/components/loading/Loader';
import UserProfile from '@/components/profile/UserProfile';
import LoginForm from '@/components/form/LoginForm';
import { captainsLog } from '@/util/captainsLog';

export default function UserPage({ auth }: { auth: Auth }) {
  captainsLog(-100, 250, ['USER PAGE']); // **LOGDATA
  const { user, isLoading } = auth;
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading && initialLoad) {
      setInitialLoad(false); // loader only on page render. IsLoading also powers submit buttons
    }
  }, [initialLoad, isLoading]);

  return (
    <AnimatePresence mode='wait'>
      {initialLoad ? (
        <Loader      key='loader' />
      ) : user ? (
        <UserProfile key='profile' {...auth} />
      ) : (
        <LoginForm   key='form'    {...auth} />
      )}
    </AnimatePresence>
  );
}
