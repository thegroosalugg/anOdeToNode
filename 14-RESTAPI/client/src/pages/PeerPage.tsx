import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import usePagination from '@/hooks/usePagination';
import { Authorized } from './RootLayout';
import User from '@/models/User';
import Post from '@/models/Post';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PeerProfile from '@/components/social/PeerProfile';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';

export default function PeerPage({ user, setUser }: Authorized) {
  const { data: peer, isLoading, error, reqHandler: reqPeer } = useFetch<User | null>();
  const {      userId      } = useParams();
  const { fetcher, ...rest } = usePagination<Post>(`social/posts/${userId}`, !!userId);
  const       navigate       = useNavigate();
  const      isInitial       = useRef(true);

  useEffect(() => {
    if (userId === user._id) {
      navigate('/');
      return;
    }

    const fetchPeer = async () => {
      if (userId) await reqPeer({ url: `social/find/${userId}` });
    };

    if (isInitial.current) {
      fetchPeer();
      isInitial.current = false;
    }
  }, [userId, user?._id, reqPeer, navigate]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      {peer && (
        <>
          <PeerProfile {...{ user, setUser, peer }} />
          <PagedList<Post> {...{ ...rest, config: 'feed' }}>
            {(post) => <PostItem {...post} />}
          </PagedList>
        </>
      )}
    </AsyncAwait>
  );
}
