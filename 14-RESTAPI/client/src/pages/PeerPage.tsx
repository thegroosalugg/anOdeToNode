import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '@/lib/hooks/useFetch';
import { useSocket } from '@/lib/hooks/useSocket';
import { usePagedFetch } from '@/components/pagination/usePagedFetch';
import { useDepedencyTracker } from '@/lib/hooks/useDepedencyTracker';
import { Authorized } from '@/lib/types/auth';
import User from '@/models/User';
import Post from '@/models/Post';
import Logger from '@/models/Logger';
import AsyncAwait from '@/components/ui/boundary/AsyncAwait';
import PeerProfile from '@/components/social/PeerProfile';
import FriendsList from '@/components/profile/FriendsList';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';

export default function PeerPage({ user, setUser }: Authorized) {
  const { data: peer, isLoading, error, reqData } = useFetch<User | null>();
  const { userId } = useParams();
  const {
    fetcher: { setData },
   ...rest
  } = usePagedFetch<Post>(`social/posts/${userId}`, 4, !!userId);
  const   navigate   = useNavigate();
  const  isInitial   = useRef(true);
  const  socketRef   = useSocket('peer');
  const { pathname } = useLocation();

  useDepedencyTracker('peer', {
     pathname,
    socketRef,
       userId,
      reqUser: user._id,
         peer: peer?._id,
  });

  useEffect(() => {
    if (!pathname.startsWith('/user')) return; // cancel effects on dismount (AnimatePresense)

    if (userId === user._id) {
      navigate('/');
      return;
    }

    const socket = socketRef.current;
    if (!socket) return;

    const fetchPeer = async () => {
      if (userId) await reqData({ url: `social/find/${userId}` });
    };

    if (isInitial.current) {
      fetchPeer();
      isInitial.current = false;
    }

    if (!peer?._id) return;

    const logger = new Logger('peer');
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
      }
    }
  }, [pathname, socketRef, userId, user._id, peer?._id, setData, reqData, navigate]);

  return (
    <AsyncAwait {...{ isLoading, error }}>
      {peer && (
        <>
          <PeerProfile {...{ user, setUser, peer }} />
          <FriendsList target={peer} watcher={user} />
          <PagedList<Post>
            fallback={`${peer.name} hasn't posted anything yet @end`}
            {...rest}
          >
            {(post) => <PostItem {...post} />}
          </PagedList>
        </>
      )}
    </AsyncAwait>
  );
}
