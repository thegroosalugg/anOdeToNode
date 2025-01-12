import useFetch from '@/hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthProps } from './RootLayout';
import { FetchError } from '@/util/fetchData';
import Post from '@/models/Post';
import Loader from '@/components/loading/Loader';
import PostId from '@/components/post/PostId';
import Error from '@/components/error/Error';
import Modal from '@/components/modal/Modal';
import PostForm from '@/components/form/PostForm';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import { captainsLog } from '@/util/captainsLog';

export default function PostPage({ user, setUser }: AuthProps) {
  const   navigate = useNavigate();
  const { postId } = useParams();
  const { data: post, setData, reqHandler, isLoading, error } = useFetch<Post | null>();
  const [modalState, setModalState] = useState('');
  const isInitial = useRef(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        await reqHandler({ url: `feed/find/${postId}` });
      }
    }

    if (isInitial.current) {
      isInitial.current = false;
      captainsLog(-100, 30, ['POSTPAGE effect, ID:' + postId]); // **LOGDATA
      fetchPost();
    }
  }, [postId, reqHandler]);

  function updatePost(post: Post) {
    setData(post);
    setModalState('');
  }

  async function deletePost() {
    setModalState('');
    const res = await reqHandler({ url: `post/delete/${postId}`, method: 'DELETE' });
    if (res === null) navigate('/'); // null is returned to data state, confirming deletion
  }

  function on401(err: FetchError) {
    if (err.status === 401) setUser(null);
  }

  return (
    <>
      <Modal show={modalState} close={() => setModalState('')}>
        {modalState ===  'edit'  && (
          <PostForm
            onSuccess={updatePost}
               on401={on401}
                 url={`post/edit/${postId}`}
              method='PUT'
                post={post}
          />
        )}
        {modalState === 'delete' && (
          <ConfirmDialog
            onConfirm={deletePost}
             onCancel={() => setModalState('')}
          />
        )}
      </Modal>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : post && (
        <PostId
              post={post}
              user={user}
          setModal={setModalState}
        />
      )}
    </>
  );
}
