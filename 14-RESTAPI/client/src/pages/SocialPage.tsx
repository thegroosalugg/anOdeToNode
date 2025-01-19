import { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { Auth } from './RootLayout';
import User from '@/models/User';
import { Pages, Paginated } from '@/components/pagination/Pagination';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import UserItem from '@/components/social/UserItem';

const initialData: Paginated<User, 'users'> = {
  docCount: 0,
     users: [],
};

export default function SocialPage({ user }: Auth) {
  const {
          data: { docCount, users },
    reqHandler,
     isLoading,
         error,
  } = useFetch(initialData);
  const [pages, setPages] = useState<Pages>([1, 1]);
  const [, current] = pages;
  const url = `social/users?page=${current}`;

  const commProps = {
        type: 'users' as const,
       items: users,
       pages,
    setPages,
    docCount,
  };

  useEffect(() => {
    const mountData = async () => await reqHandler({ url });
    mountData();
  }, [url, reqHandler]);

  console.log('users', users, docCount);
  return (
    <AsyncAwait {...{ isLoading, error }}>
      <PagedList <User> {...commProps}>
        {(user) => <UserItem user={user} />}
      </PagedList>
    </AsyncAwait>
  );
}
