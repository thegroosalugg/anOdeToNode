import { useEffect, useRef, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import Post from '@/models/Post';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import PostForm from '@/components/form/PostForm';
import Error from '@/components/error/Error';

export default function FeedPage() {
  const {
          data: posts,
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch<Post[]>([]);
  const {             reqHandler: updateReq } = useFetch<Post[]>([]);
  const { data: user, reqHandler: fetchUser } = useFetch<User>();
  const [  showModal,          setShowModal ] = useState(false);
  const isInitial = useRef(true);

  useEffect(() => {
    const mountData = async () => {
      await Promise.all([
        initialReq({ url: 'feed/posts?page=1' }),
         fetchUser({ url: 'login' })
      ]);
    };

    const updateData = async () => {
      const updatedData = await updateReq({ url: 'feed/posts?page=3' });
      setData(updatedData);
    };

    if (isInitial.current) {
      isInitial.current = false;
      mountData();
      console.log('IS INITIAL');
    } else {
      updateData();
      console.log('UPDATING');
    }
  }, [updateReq, initialReq, fetchUser, setData, showModal]);

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <PostForm          callback={() => setShowModal(false)} />
      </Modal>
      {user && (
        <Button
              hsl={[180, 80, 35]}
            style={{ margin: '0 auto 1rem' }}
          onClick={() => setShowModal(true)}
        >
          New Post
        </Button>
      )}
      {isLoading ? <Loader /> : error ? <Error error={error} /> : <Feed feed={posts} />}
    </>
  );
}
