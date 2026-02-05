import { useEffect, useState } from 'react';
import { Auth } from "@/lib/types/interface";
import UserProfile from '@/components/user/UserProfile';
import AuthForm from '@/components/form/forms/auth/AuthForm';
import AsyncAwait from '@/components/ui/boundary/AsyncAwait';

export default function AuthPage(props: Auth) {
  const { user, setUser, isLoading } = props;
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    // loader only on page render. IsLoading also powers submit buttons
    if (!isLoading && isInitial) setIsInitial(false)
  }, [isInitial, isLoading]);

  return (
    <AsyncAwait {...{ isLoading: isInitial }}>
      {user ? <UserProfile key="profile" {...{ user, setUser }} /> : <AuthForm key="form" {...props} />}
    </AsyncAwait>
  );
}
