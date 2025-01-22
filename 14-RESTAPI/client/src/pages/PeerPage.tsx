import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { Auth } from './RootLayout';
import User from '@/models/User';
import Post from '@/models/Post';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PeerProfile from '@/components/social/PeerProfile';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';
import { Pages, Paginated } from '@/components/pagination/Pagination';

const initialData: Paginated<Post, 'posts'> = {
  docCount: 0,
     posts: [],
}

export default function UserPage({ user }: Auth) {
  const { data: peer, isLoading, error, reqHandler: reqPeer } = useFetch<User | null>();
  const {
          data: { posts, docCount },
    reqHandler: reqPosts,
  } = useFetch(initialData);  const { userId } = useParams();
  const [pages, setPages] = useState<Pages>([1, 1]);
  const [,       current] = pages;
  const  navigate = useNavigate();
  const isInitial = useRef(true);
  const feedProps = { type: 'feed' as const, items: posts, docCount, pages, setPages };

  useEffect(() => {
    const fetchPeer = async () => {
      if (userId) await reqPeer({ url: `social/find/${userId}` });
    };

    const fetchPosts = async () => {
      if (userId) await reqPosts({ url: `social/posts/${userId}?page=${current}` });
    }

    if (userId === user?._id) {
      navigate('/');
      return;
    }

    const initialData = async () => await Promise.all([fetchPeer(), fetchPosts()]);
    if (isInitial.current) {
      isInitial.current = false;
      initialData();
    } else {
      fetchPosts();
    }
  }, [userId, user?._id, current, reqPeer, reqPosts, navigate]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      {peer && <PeerProfile peer={peer} />}
      <PagedList<Post> {...feedProps}>
        {(post) => <PostItem {...post} />}
      </PagedList>
    </AsyncAwait>
  );
}
