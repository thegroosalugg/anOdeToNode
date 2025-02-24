import { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import useInitial from '@/hooks/useInitial';
import useSocket from '@/hooks/useSocket';
import { Authorized } from './RootLayout';
import User from '@/models/User';
import { Pages, Paginated } from '@/components/pagination/Pagination';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import PeerItem from '@/components/social/PeerItem';
import { captainsLog } from '@/util/captainsLog';

const initialData: Paginated<User, 'users'> = {
  docCount: 0,
     users: [],
};

export default function SocialPage({ user }: Authorized) {
  const {
          data: { docCount, users },
       setData: setUsers,
    reqHandler,
         error,
  } = useFetch(initialData);
  const         socketRef         = useSocket('SOCIAL');
  const { isInitial,  mountData } = useInitial();
  const [pages,         setPages] = useState<Pages>([1, 1]);
  const [,               current] = pages;
  const url = `social/users?page=${current}`;

  const commProps = {
        type: 'users' as const,
       items: users,
       pages,
    setPages,
    docCount,
  };

  useEffect(() => {
    const initData = async () => mountData(async () => await reqHandler({ url }), 2);
    initData();

    const socket = socketRef.current;
    if (!socket) return;
    socket.on('connect', () => captainsLog([-100, 235], ['⚽ SOCIALPAGE: Socket connected']));

    socket.on('user:new', (newUser) => {
      setUsers(({ docCount, users }) => {
        captainsLog([-100, 230], ['⚽ SOCIALPAGE NEW USER', newUser]); // **LOGDATA
        return { docCount: docCount + 1, users: [newUser, ...users] };
      });
    });

    return () => {
      socket.off('connect');
      socket.off('user:new');
    }
  }, [socketRef, url, reqHandler, mountData, setUsers]);

  return (
    <AsyncAwait {...{ isLoading: isInitial, error }}>
      <PagedList<User>
        {...commProps}
        whileHover={{ y: -2, transition: { ease: 'easeInOut' } }}
      >
        {(user) => <PeerItem user={user} />}
      </PagedList>
    </AsyncAwait>
  );
}
