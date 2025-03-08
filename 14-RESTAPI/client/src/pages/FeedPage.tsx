import { useEffect, useState } from 'react';
import usePagination from '@/hooks/usePagination';
import useSocket from '@/hooks/useSocket';
import { Authorized } from './RootLayout';
import Post from '@/models/Post';
import Logger from '@/models/Logger';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import PostForm from '@/components/form/PostForm';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';

export default function FeedPage({ setUser }: Authorized) {
  const {
    fetcher: { setData, isLoading, error },
     ...rest
  } = usePagination<Post>('feed/posts');
  const        socketRef          = useSocket('FEED');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const logger = new Logger('feed');
    socket.on('connect', () => logger.connect());

    socket.on('post:update', (newPost) => {
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const isFound = prevPosts.some(({ _id }) => _id === newPost._id);
        const   items = isFound
          ? prevPosts.map((oldPost) => (newPost._id === oldPost._id ? newPost : oldPost))
          : [newPost, ...prevPosts];

        const docCount = prevCount + 1;
        logger.event(`update, action: ${isFound ? 'Edit' : 'New'})`, newPost);
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
      <Modal show={showModal}           close={closeModal}>
        <PostForm setUser={setUser} onSuccess={closeModal} />
      </Modal>
      <Button
          onClick={() => setShowModal(true)}
              hsl={[180, 80, 35]}
            style={{ margin: '0 auto 0.5rem' }}
        animateEx={{ transition: { opacity: { delay: 0.8 }}}}
      >
        New Post
      </Button>
      <AsyncAwait {...{ isLoading, error }}>
        <PagedList<Post> {...{ ...rest, config: 'feed' }}>
          {(post) => <PostItem {...post} />}
        </PagedList>
      </AsyncAwait>
    </>
  );
}
