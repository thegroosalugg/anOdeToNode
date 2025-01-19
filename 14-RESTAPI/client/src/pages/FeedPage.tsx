import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import useFetch from '@/hooks/useFetch';
import { Auth } from './RootLayout';
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

export default function FeedPage({ setUser }: Auth) {
  const {
          data: { docCount, posts },
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch(initialData);
  const               isInitial   = useRef(true);
  const { reqHandler: updateReq } = useFetch(initialData);
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
    const  mountData = async () => await initialReq({ url });
    const updateData = async () => await  updateReq({ url },
      { onSuccess: (updated) => setData(updated) }
    );

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
      captainsLog(-100, 270, ['FEEDPAGE INITIAL'] ); // **LOGDATA
    } else {
      updateData();
      captainsLog(-100, 260, ['FEEDPAGE UPDATING'] ); // **LOGDATA
    }

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog(-100, 250, ['FEEDPAGE: Socket connected']));

    socket.on('post:update', (newPost) => {
      setData(({ docCount, posts: prevPosts }) => {
        const isFound = prevPosts.some(({ _id }) => _id === newPost._id);
        const posts = isFound
          ? prevPosts.map((oldPost) => (newPost._id === oldPost._id ? newPost : oldPost))
          : [newPost, ...prevPosts];

        captainsLog(-100, 240, ['FEEDPAGE ' + (isFound ? 'EDIT' : 'NEW'), newPost]);
        return { docCount, posts };
      });
    });

    socket.on('post:delete', (deleted) => {
      setData(({ docCount, posts: prevPosts }) => {
        const posts = prevPosts.filter(({ _id }) => _id !== deleted._id);
        captainsLog(-100, 280, ['FEEDPAGE DELETED', deleted]);
        return { docCount, posts };
      });
    });

    return () => {
      socket.off('connect');
      socket.off('post:update');
      socket.off('post:delete');
      socket.disconnect();
    };
  }, [initialReq, updateReq, setData, url]);

  const closeModal = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal}           close={closeModal}>
        <PostForm setUser={setUser} onSuccess={closeModal} />
      </Modal>
      <Button
          onClick={() => setShowModal(true)}
              hsl={[180, 80, 35]}
            style={{ margin: '0 auto 1rem' }}
        animateEx={{ transition: { opacity: { delay: 0.8 }}}}
      >
        New Post
      </Button>
      <AsyncAwait {...{ isLoading, error }}>
        <PagedList <Post> {...feedProps}>
          {(post) => <PostItem {...post} />}
        </PagedList>
      </AsyncAwait>
    </>
  );
}
