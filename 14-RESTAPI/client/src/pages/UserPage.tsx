import LoginForm from '@/components/form/LoginForm';
import { AuthProps } from './RootLayout';
import UserProfile from '@/components/profile/UserProfile';
import { captainsLog } from '@/util/captainsLog';
import { AnimatePresence } from 'motion/react';

export default function UserPage({ props }: { props: AuthProps }) {
  captainsLog(-100, 250, ['USER PAGE']); // **LOGDATA
  const { user } = props;
  return (
    <AnimatePresence mode='wait'>
      {user ? (
        <UserProfile {...props} key='profile' />
      ) : (
        <LoginForm   {...props} key='form' />
      )}
    </AnimatePresence>
  );
}
