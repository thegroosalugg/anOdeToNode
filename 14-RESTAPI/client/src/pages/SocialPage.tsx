import { useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { Auth } from './RootLayout';
import User from '@/models/User';
import { Pages, Paginated } from '@/components/pagination/Pagination';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import UserItem from '@/components/social/UserItem';
import { captainsLog } from '@/util/captainsLog';

const initialData: Paginated<User, 'users'> = {
  docCount: 0,
     users: [],
};

export default function SocialPage({ user }: Auth) {
  const {
          data: { docCount, users },
    reqHandler,
         error,
  } = useFetch(initialData);
  const [pages, setPages] = useState<Pages>([1, 1]);
  const isInitial = useRef(true);
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
    const mountData = async () => {
      await reqHandler({ url });
      if (isInitial.current) isInitial.current = false;
      captainsLog(-100, 80, ['SOCIAL PAGE']); // **LOGDATA
    }
    mountData();
  }, [url, reqHandler]);

  return (
    <AsyncAwait isLoading={isInitial.current} error={error}>
      <PagedList <User> {...commProps}>
        {(user) => <UserItem user={user} />}
      </PagedList>
    </AsyncAwait>
  );
}
