import { useEffect } from 'react';
import usePagination from '@/hooks/usePagination';
import useSocket from '@/hooks/useSocket';
import { Authorized } from './RootLayout';
import User from '@/models/User';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import PeerItem from '@/components/social/PeerItem';
import { captainsLog } from '@/util/captainsLog';


export default function SocialPage({ user }: Authorized) {
  const {
    fetcher: { setData, isLoading, error },
     ...rest
  } = usePagination<User>('social/users');
  const socketRef = useSocket('SOCIAL');

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on('connect', () => captainsLog(235, ['⚽ SOCIALPAGE: Socket connected']));

    socket.on('user:new', (newUser) => {
      setData(({ docCount, items }) => {
        captainsLog(230, ['⚽ SOCIALPAGE NEW USER', newUser]); // **LOGDATA
        return { docCount: docCount + 1, items: [newUser, ...items] };
      });
    });

    return () => {
      socket.off('connect');
      socket.off('user:new');
    }
  }, [socketRef, setData]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      <PagedList<User>
        {...{ ...rest, config: 'users' }}
        whileHover={{ y: -2, transition: { ease: 'easeInOut' } }}
      >
        {(user) => <PeerItem user={user} />}
      </PagedList>
    </AsyncAwait>
  );
}
