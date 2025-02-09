import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import useFetch from '@/hooks/useFetch';
import { Authorized } from './RootLayout';
import Post from '@/models/Post';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import PostForm from '@/components/form/PostForm';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PagedList from '@/components/pagination/PagedList';
import PostItem from '@/components/post/PostItem';
import { Pages, Paginated } from '@/components/pagination/Pagination';
import { captainsLog } from '@/util/captainsLog';

const initialData: Paginated<Post, 'posts'> = {
  docCount: 0,
     posts: [],
};

export default function FeedPage({ setUser }: Authorized) {
  const {
          data: { docCount, posts },
       setData,
    reqHandler,
         error,
  } = useFetch(initialData);
  const               isInitial   = useRef(true);
  const [showModal, setShowModal] = useState(false);
  const [pages,         setPages] = useState<Pages>([1, 1]);
  const [,               current] = pages;
  const                      url  = `feed/posts?page=${current}`;

  const feedProps = {
        type: 'feed' as const,
       items: posts,
       pages,
    setPages,
    docCount,
  };

  useEffect(() => {
    const mountData = async () => {
      await reqHandler({ url });
      if (isInitial.current) isInitial.current = false;
      captainsLog([-1, 70], ['🗞️ FEEDPAGE mountData'] ); // **LOGDATA
    }
    mountData();

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog([-100, 80], ['🗞️ FEEDPAGE: Socket connected']));

    socket.on('post:update', (newPost) => {
      setData(({ docCount: prevCount, posts: prevPosts }) => {
        const isFound = prevPosts.some(({ _id }) => _id === newPost._id);
        const   posts = isFound
          ? prevPosts.map((oldPost) => (newPost._id === oldPost._id ? newPost : oldPost))
          : [newPost, ...prevPosts];

        const docCount = prevCount + 1;
        captainsLog([-100, 85], ['🗞️ FEEDPAGE ' + (isFound ? 'EDIT' : 'NEW'), newPost]);
        return { docCount, posts };
      });
    });

    socket.on('post:delete', (deleted) => {
      setData(({ docCount: prevCount, posts: prevPosts }) => {
        const    posts = prevPosts.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        captainsLog([-100, 90], ['🗞️ FEEDPAGE DELETED', deleted]);
        return { docCount, posts };
      });
    });

    return () => {
      socket.off('connect');
      socket.off('post:update');
      socket.off('post:delete');
      socket.disconnect();
      captainsLog([-1, 70], ['🗞️ FEEDPAGE Disconnected'] ); // **LOGDATA
    };
  }, [reqHandler, setData, url]);

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
      <AsyncAwait isLoading={isInitial.current} error={error}>
        <PagedList<Post> {...feedProps}>
          {(post) => <PostItem {...post} />}
        </PagedList>
      </AsyncAwait>
    </>
  );
}
