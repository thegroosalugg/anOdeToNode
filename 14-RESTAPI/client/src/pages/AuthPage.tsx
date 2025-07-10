import { useEffect, useState } from 'react';
import { Auth, Authorized } from '@/lib/types/auth';
import UserProfile from '@/components/user/UserProfile';
import AuthForm from '@/components/form/forms/auth/AuthForm';
import AsyncAwait from '@/components/ui/boundary/AsyncAwait';

export default function AuthPage({ auth }: { auth: Auth }) {
  const { user, isLoading } = auth;
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    // loader only on page render. IsLoading also powers submit buttons
    if (!isLoading && isInitial) setIsInitial(false)
  }, [isInitial, isLoading]);

  return (
    <AsyncAwait {...{ isLoading: isInitial }}>
      {user ? (
        <UserProfile key='profile' {...auth as Authorized} />
      ) : (
        <AuthForm   key='form'    {...auth} />
      )}
    </AsyncAwait>
  );
}
