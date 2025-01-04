import { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import Post from '@/models/Post';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import Error from '@/components/error/Error';

export default function FeedPage() {
  const {
          data: posts,
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch<Post[]>([], true);
  const {             reqHandler: updateReq } = useFetch<Post[]>([]);
  const { data: user, reqHandler: fetchUser } = useFetch<User | null>(null); // eslint-disable-line
  const [  showModal,          setShowModal ] = useState(false);

  useEffect(() => {
    const mountData = async () => {
      await initialReq({ url: 'feed/posts' });
      await  fetchUser({ url: 'login'      });
    }
    mountData();
  }, [initialReq, fetchUser]);

  useEffect(() => {
    const updateData = async () => {
      const updatedData = await updateReq({ url: 'feed/posts' });
      setData(updatedData);
    };
    updateData();
  }, [updateReq, setData, showModal]);

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <Form callback={() => setShowModal(false)} />
      </Modal>
      <Button
            hsl={[180, 80, 35]}
          style={{ margin: '0 auto 1rem' }}
        onClick={() => setShowModal(true)}
      >
        New Post
      </Button>
      {isLoading ? <Loader /> : error ? <Error error={error} /> : <Feed feed={posts} />}
    </>
  );
}
