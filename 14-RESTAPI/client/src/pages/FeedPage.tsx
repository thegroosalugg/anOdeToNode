import { useEffect, useState } from 'react';
import usePagination from '@/hooks/usePagination';
import useSocket from '@/hooks/useSocket';
import { Authorized } from './RootLayout';
import Post from '@/models/Post';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import PostForm from '@/components/form/PostForm';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';
import { captainsLog } from '@/util/captainsLog';

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
    socket.on('connect', () => captainsLog(80, ['🗞️ FEEDPAGE: Socket connected']));

    socket.on('post:update', (newPost) => {
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const isFound = prevPosts.some(({ _id }) => _id === newPost._id);
        const   items = isFound
          ? prevPosts.map((oldPost) => (newPost._id === oldPost._id ? newPost : oldPost))
          : [newPost, ...prevPosts];

        const docCount = prevCount + 1;
        captainsLog(85, ['🗞️ FEEDPAGE ' + (isFound ? 'EDIT' : 'NEW'), newPost]);
        return { docCount, items };
      });
    });

    socket.on('post:delete', (deleted) => {
      setData(({ docCount: prevCount, items: prevPosts }) => {
        const    items = prevPosts.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        captainsLog(90, ['🗞️ FEEDPAGE DELETED', deleted]);
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
