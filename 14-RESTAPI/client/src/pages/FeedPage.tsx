import { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import User from '@/models/User';
import Post from '@/models/Post';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';
import Form from '@/components/form/Form';

export default function FeedPage() {
  const {
          data: posts,
       setData,
    reqHandler: initialReq,
         error,
     isLoading,
  } = useFetch<Post[]>([]);
  const { reqHandler: updateReq } = useFetch<Post[]>([]);
  const {
          data: newPost,
         error: postErr,
    reqHandler: postReq,
  } = useFetch<Post | null>(null);
  const { data: user, reqHandler: fetchUser } = useFetch<User | null>(null);

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
  }, [updateReq, setData, newPost]);
  const [showModal, setShowModal] = useState(false);

  async function submitPost(data: FormData) {
    setShowModal(false);
    await postReq({ url: 'feed/new-post', method: 'POST', data });
  }

  if (user) // to quiet TS unused var warning
  console.log(
    //       'error', error, postErr,
    // '\nisLoading', isLoading,
        //  '\ndata', posts, user,
    //   '\nnewPost', newPost
  ); // **LOGDATA

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <Form dataFn={submitPost} />
      </Modal>
      <Button
            hsl={[180, 80, 35]}
          style={{ margin: '1rem auto 0' }}
        onClick={() => setShowModal(true)}
      >
        New Post
      </Button>
      {postErr && <p>{postErr.message}</p>}
      {isLoading ? <Loader /> : error ? <p>{error.message}</p> : <Feed feed={posts} />}
    </>
  );
}
