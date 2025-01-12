import LoginForm from '@/components/form/LoginForm';
import { AuthProps } from './RootLayout';
import Loader from '@/components/loading/Loader';
import UserProfile from '@/components/profile/UserProfile';
import { captainsLog } from '@/util/captainsLog';

export default function UserPage({ user, setUser, isLoading }: AuthProps) {
  captainsLog(-100, 250, ['USER PAGE']); // **LOGDATA
  const props = { user, setUser };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : user ? (
        <UserProfile {...props} />
      ) : (
        <LoginForm callback={(user) => setUser(user)} />
      )}
    </>
  );
}
