import LoginForm from '@/components/form/LoginForm';
import { AuthProps } from './RootLayout';
import Loader from '@/components/loading/Loader';
import UserProfile from '@/components/profile/UserProfile';

export default function UserPage({ user, setData, isLoading }: AuthProps) {
  function logout() {
    setData(null);
    localStorage.removeItem('jwt-access');
    localStorage.removeItem('jwt-refresh');
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : user ? (
        <UserProfile user={user} logout={logout} />
      ) : (
        <LoginForm callback={(user) => setData(user)} />
      )}
    </>
  );
}
