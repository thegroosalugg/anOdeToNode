import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { Auth } from './RootLayout';
import User from '@/models/User';
import AsyncAwait from '@/components/panel/AsyncAwait';

export default function UserPage({ user }: Auth) {
  const { data: peer, isLoading, error, reqHandler } = useFetch<User | null>();
  const { userId } = useParams();
  const isInitial = useRef(true);

  useEffect(() => {
    const mountData = async () => {
      if (userId) await reqHandler({ url: `social/find/${userId}` });
    };

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
    }
  }, [userId, reqHandler]);

  return <AsyncAwait {...{ isLoading, error }}>{<p>{peer?.name}</p>}</AsyncAwait>;
}
