import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import useSocket from '@/hooks/useSocket';
import usePagination from '@/hooks/usePagination';
import { Authorized } from './RootLayout';
import User from '@/models/User';
import Post from '@/models/Post';
import Logger from '@/models/Logger';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PeerProfile from '@/components/social/PeerProfile';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';

export default function PeerPage({ user, setUser }: Authorized) {
  const { data: peer, isLoading, error, reqHandler } = useFetch<User | null>();
  const { userId } = useParams();
  const {
    fetcher: { setData },
   ...rest
  } = usePagination<Post>(`social/posts/${userId}`, !!userId);
  const   navigate   = useNavigate();
  const  isInitial   = useRef(true);
  const  socketRef   = useSocket('user');
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith('/user')) return; // cancel effects on dismount (AnimatePresense)

    if (userId === user._id) {
      navigate('/');
      return;
    }

    const socket = socketRef.current;
    if (!socket) return;

    const fetchPeer = async () => {
      if (userId) await reqHandler({ url: `social/find/${userId}` });
    };

    if (isInitial.current) {
      fetchPeer();
      isInitial.current = false;
    }

    if (!peer?._id) return;

    const logger = new Logger('user');
    if (socket.connected) logger.connect();

    socket.on(`post:${peer?._id}:update`, ({ post, isNew }) => {
      logger.event(`update, action: ${isNew ? 'New' : 'Edit'}`, post);
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const items = isNew
          ? [post, ...prevPosts]
          : prevPosts.map((prev) => (post._id === prev._id ? post : prev));

        const docCount = prevCount + (isNew ? 1 : 0);
        return { docCount, items };
      });
    });

    socket.on(`post:${peer?._id}:delete`, (deleted) => {
      logger.event('delete', deleted);
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const    items = prevPosts.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        return { docCount, items };
      });
    });

    return () => {
      if (socket.connected) {
        socket.off(`post:${peer?._id}:update`);
        socket.off(`post:${peer?._id}:delete`);
        logger.off();
      }
    }
  }, [pathname, socketRef, userId, user?._id, peer?._id, setData, reqHandler, navigate]);

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
