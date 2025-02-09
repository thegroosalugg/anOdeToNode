import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Auth, Authorized } from './RootLayout';
import Loader from '@/components/loading/Loader';
import UserProfile from '@/components/profile/UserProfile';
import LoginForm from '@/components/form/LoginForm';
import { captainsLog } from '@/util/captainsLog';

export default function AuthPage({ auth }: { auth: Auth }) {
  const { user, isLoading } = auth;
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (!isLoading && isInitial) {
      setIsInitial(false); // loader only on page render. IsLoading also powers submit buttons
      captainsLog([-100, -55], ['👤 USER PAGE isInitial']); // **LOGDATA
    }
  }, [isInitial, isLoading]);

  return (
    <AnimatePresence mode='wait'>
      {isInitial ? (
        <Loader      key='loader' />
      ) : user ? (
        <UserProfile key='profile' {...auth as Authorized} />
      ) : (
        <LoginForm   key='form'    {...auth} />
      )}
    </AnimatePresence>
  );
}
