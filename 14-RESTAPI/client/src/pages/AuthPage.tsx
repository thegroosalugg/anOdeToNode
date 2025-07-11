import { useEffect, useState } from 'react';
import { Auth, Authorized } from '@/lib/types/auth';
import UserProfile from '@/components/user/UserProfile';
import AuthForm from '@/components/form/forms/auth/AuthForm';
import AsyncAwait from '@/components/ui/boundary/AsyncAwait';

export default function AuthPage(props: Auth) {
  const { user, isLoading } = props;
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    // loader only on page render. IsLoading also powers submit buttons
    if (!isLoading && isInitial) setIsInitial(false)
  }, [isInitial, isLoading]);

  return (
    <AsyncAwait {...{ isLoading: isInitial }}>
      {user ? (
        <UserProfile key='profile' {...props as Authorized} />
      ) : (
        <AuthForm   key='form'    {...props} />
      )}
    </AsyncAwait>
  );
}
