import LoginForm from '@/components/form/LoginForm';
import { AuthProps } from './RootLayout';
import Loader from '@/components/loading/Loader';
import UserProfile from '@/components/profile/UserProfile';
import { captainsLog } from '@/util/captainsLog';
import { AnimatePresence } from 'motion/react';

export default function UserPage({ user, setUser, isLoading }: AuthProps) {
  captainsLog(-100, 250, ['USER PAGE']); // **LOGDATA
  const props = { user, setUser };
  return (
    <AnimatePresence mode='wait'>
      {isLoading ? (
        <Loader key='loader' />
      ) : user ? (
        <UserProfile {...props} key='profile' />
      ) : (
        <LoginForm callback={(user) => setUser(user)} key='form' />
      )}
    </AnimatePresence>
  );
}
