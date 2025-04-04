import { isMobile } from 'react-device-detect';
import { useEffect } from 'react';
import usePagination from '@/hooks/usePagination';
import useSocket from '@/hooks/useSocket';
import User from '@/models/User';
import Logger from '@/models/Logger';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import PeerItem from '@/components/social/PeerItem';

export default function SocialPage() {
  const {
    fetcher: { setData, isLoading, error },
     ...rest
  } = usePagination<User>('social/users', isMobile ? 8 : 10);
  const socketRef = useSocket('social');

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger('social');
    socket.on('connect', () => logger.connect());

    socket.on('user:new', (newUser) => {
      logger.event('user:new', newUser);
      setData(({ docCount, items }) => ({
        docCount: docCount + 1,
           items: [newUser, ...items],
      }));
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
        whileHover={{ y: -2, transition: { ease: 'linear', duration: 0.2 } }}
      >
        {(user) => <PeerItem user={user} />}
      </PagedList>
    </AsyncAwait>
  );
}
