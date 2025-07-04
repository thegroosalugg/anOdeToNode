import { useEffect, useState } from 'react';
import { usePagedFetch } from '@/components/pagination/usePagedFetch';
import { useSocket } from '@/lib/hooks/useSocket';
import { Authorized } from '@/lib/types/auth';
import Post from '@/models/Post';
import Logger from '@/models/Logger';
import Button from '@/components/ui/button/Button';
import PostForm from '@/components/form/PostForm';
import AsyncAwait from '@/components/ui/boundary/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';
import SideBar from '@/components/ui/menu/SideBar';

export default function FeedPage({ setUser }: Authorized) {
  const {
    fetcher: { setData, isLoading, error },
     ...rest
  } = usePagedFetch<Post>('feed/posts', 3);
  const        socketRef          = useSocket('feed');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger('feed');
    socket.on('connect', () => logger.connect());

    socket.on('post:update', ({ post, isNew }) => {
      logger.event(`update, action: ${isNew ? 'New' : 'Edit'}`, post);
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const items = isNew
          ? [post, ...prevPosts]
          : prevPosts.map((prev) => (post._id === prev._id ? post : prev));

        const docCount = prevCount + (isNew ? 1 : 0);
        return { docCount, items };
      });
    });

    socket.on('post:delete', (deleted) => {
      logger.event('delete', deleted);
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const    items = prevPosts.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        return { docCount, items };
      });
    });

    return () => {
      socket.off('connect');
      socket.off('post:update');
      socket.off('post:delete');
    };
  }, [socketRef, setData]);

  const closeModal = () => setShowModal(false);

  return (
    <>
      <SideBar open={showModal}        close={closeModal}>
        <PostForm {...{ setUser }} onSuccess={closeModal} />
      </SideBar>
      <Button
           onClick={() => setShowModal(true)}
             style={{ margin: '0 auto 0.5rem' }}
        animations={{ transition: { opacity: { delay: 0.8 }}}}
      >
        New Post
      </Button>
      <AsyncAwait {...{ isLoading, error }}>
        <PagedList<Post>
               path="post"
           fallback="Slow news day"
          {...rest}
        >
          {(post) => <PostItem {...post} />}
        </PagedList>
      </AsyncAwait>
    </>
  );
}
