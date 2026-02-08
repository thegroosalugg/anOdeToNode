import { Auth } from "@/lib/types/interface";
import UserProfile from '@/components/user/UserProfile';
import AuthForm from '@/components/form/forms/auth/AuthForm';
import AsyncAwait from '@/components/ui/boundary/AsyncAwait';

export default function AuthPage(props: Auth) {
  const { user, setUser, isLoading } = props;

  return (
    <AsyncAwait {...{ isLoading }}>
      {user ? <UserProfile key="profile" {...{ user, setUser }} /> : <AuthForm key="form" {...{ setUser }} />}
    </AsyncAwait>
  );
}
