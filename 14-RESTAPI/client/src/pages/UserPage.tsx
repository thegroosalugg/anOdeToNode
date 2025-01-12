import LoginForm from '@/components/form/LoginForm';
import { Auth } from './RootLayout';
import UserProfile from '@/components/profile/UserProfile';
import { captainsLog } from '@/util/captainsLog';
import { AnimatePresence } from 'motion/react';

export default function UserPage({ auth }: { auth: Auth }) {
  captainsLog(-100, 250, ['USER PAGE']); // **LOGDATA
  const { user } = auth;
  return (
    <AnimatePresence mode='wait'>
      {user ? (
        <UserProfile {...auth} key='profile' />
      ) : (
        <LoginForm   {...auth} key='form' />
      )}
    </AnimatePresence>
  );
}
