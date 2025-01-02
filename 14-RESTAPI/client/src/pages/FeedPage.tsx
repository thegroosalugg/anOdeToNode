import { useEffect, useState } from 'react';
import useFetch from '@/hooks/useFetch';
import Post from '@/models/Post';
import Feed from '@/components/feed/Feed';
import Loader from '@/components/loading/Loader';
import Modal from '@/components/modal/Modal';
import Button from '@/components/button/Button';

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
  const { data: user, reqHandler: fetchUser } = useFetch<Post[]>([]);


  useEffect(() => {
    const mountData = async () => {
      await initialReq({ url: 'feed/posts' });
      await fetchUser({ url: 'login' });
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

  async function clickHandler() {
    setShowModal(false);
    await postReq({
         url: 'feed/new-post',
      method: 'POST',
        data: {
          title: 'Number Two',
        content: 'This is number two.',
      },
    });
  }

  console.log(
          'error', error, postErr,
  //   '\nisLoading', isLoading,
         '\ndata', user,
  //     '\nnewPost', newPost
  ); // **LOGDATA

  return (
    <>
      <Modal show={showModal} close={() => setShowModal(false)}>
        <div style={{ width: '500px', height: '300px', background: '#de1b1bbf' }}>
          <h2>Form</h2>
          <button onClick={clickHandler}>New Post</button>
        </div>
      </Modal>
      <Button
            hsl={[180, 80, 35]}
          style={{ marginBottom: 0 }}
        onClick={() => setShowModal(true)}
      >
        New Post
      </Button>
      {postErr && <p>{postErr.message}</p>}
      {isLoading ? <Loader /> : error ? <p>{error.message}</p> : <Feed feed={posts} />}
    </>
  );
}
