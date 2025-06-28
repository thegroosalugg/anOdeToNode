import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Auth, Authorized } from '@/lib/types/auth';
import Loader from '@/components/ui/boundary/loader/Loader';
import UserProfile from '@/components/profile/UserProfile';
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
        <UserProfile key='profile' {...auth as Authorized} />
      ) : (
        <LoginForm   key='form'    {...auth} />
      )}
    </AnimatePresence>
  );
}
