import LoginForm from '@/components/form/LoginForm';
import { AuthProps } from './RootLayout';
import Loader from '@/components/loading/Loader';
import UserProfile from '@/components/profile/UserProfile';
import { captainsLog } from '@/util/captainsLog';

export default function UserPage({ user, setUser, isLoading }: AuthProps) {
  function logout() {
    setUser(null);
    localStorage.removeItem('jwt-access');
    localStorage.removeItem('jwt-refresh');
  }

  captainsLog(-100, 250, ['USER PAGE']); // **LOGDATA

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : user ? (
        <UserProfile user={user} logout={logout} />
      ) : (
        <LoginForm callback={(user) => setUser(user)} />
      )}
    </>
  );
}
