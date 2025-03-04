import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { Authorized } from './RootLayout';
import User from '@/models/User';
import Post from '@/models/Post';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PeerProfile from '@/components/social/PeerProfile';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';
import { Pages, Paginated } from '@/components/pagination/Pagination';
import { captainsLog } from '@/util/captainsLog';

const initialData: Paginated<Post, 'posts'> = {
  docCount: 0,
     posts: [],
}

export default function PeerPage({ user, setUser }: Authorized) {
  const { data: peer, isLoading, error, reqHandler: reqPeer } = useFetch<User | null>();
  const {
          data: { posts, docCount },
    reqHandler: reqPosts,
  } = useFetch(initialData);
  const [pages, setPages] = useState<Pages>([1, 1]);
  const [,       current] = pages;
  const {  userId  } = useParams();
  const { pathname } = useLocation();
  const  navigate = useNavigate();
  const isInitial = useRef(true);
  const feedProps = { type: 'feed' as const, items: posts, docCount, pages, setPages };

  useEffect(() => {
    const fetchPeer = async () => {
      if (userId) {
        await reqPeer({ url: `social/find/${userId}` });
        captainsLog([-100, 252], ['⚓ PEERPAGE: fetchPeer']);
      }
    };

    const fetchPosts = async () => {
      if (userId) {
        await reqPosts({ url: `social/posts/${userId}?page=${current}` });
        captainsLog([-100, 258], ['⚓ PEERPAGE: fetchPosts']);
      }
    }

    if (userId === user._id) {
      navigate('/');
      return;
    }

    const initialData = async () => await Promise.all([fetchPeer(), fetchPosts()]);
    if (isInitial.current) {
      isInitial.current = false;
      initialData();
    } else if (pathname.startsWith('/user')) {
      fetchPosts();
    }
  }, [userId, user?._id, current, pathname, reqPeer, reqPosts, navigate]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      {peer && (
        <>
          <PeerProfile {...{ user, setUser, peer }} />
          <PagedList<Post> {...feedProps}>
            {(post) => <PostItem {...post} />}
          </PagedList>
        </>
      )}
    </AsyncAwait>
  );
}
