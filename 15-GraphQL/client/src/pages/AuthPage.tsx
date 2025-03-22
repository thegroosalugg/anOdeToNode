import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Auth, Authorized } from './RootLayout';
import Loader from '@/components/loading/Loader';
import LoginForm from '@/components/form/LoginForm';

export default function AuthPage({ auth }: { auth: Auth }) {
  const { user,       isLoading } = auth;
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    // loader only on page render. IsLoading also powers submit buttons
    if (!isLoading && isInitial) setIsInitial(false)
  }, [isInitial, isLoading]);

  return (
    <AnimatePresence mode='wait'>
      {isInitial ? (
        <Loader      key='loader' />
      ) : user ? (
        <></>
      ) : (
        <LoginForm   key='form'    {...auth} />
      )}
    </AnimatePresence>
  );
}
