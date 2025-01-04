import useFetch from '@/hooks/useFetch';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '@/models/Post';
import User from '@/models/User';
import Loader from '@/components/loading/Loader';
import PostId from '@/components/post/PostId';
import Error from '@/components/error/Error';
import Modal from '@/components/modal/Modal';
import Form from '@/components/form/Form';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: post, reqHandler, isLoading, error } = useFetch<Post | null>(null, true);
  const { data: user, reqHandler: fetchUser        } = useFetch<User | null>(null, true);
  const [modalState,   setModalState] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      await Promise.all([
         fetchUser({ url: 'login' }),
        reqHandler({ url: `feed/post/${postId}` })
      ]);
    }
    fetchPost();
  }, [postId, reqHandler, fetchUser]);

  async function deletePost() {
    setModalState('');
    const res = await reqHandler({ url: `feed/post/${postId}`, method: 'DELETE' });
    if (res === null) navigate('/'); // null is returned to data state, confirming deletion
  }

  return (
    <>
      <Modal show={modalState}               close={() => setModalState('')}>
        {modalState ===  'edit'  && <Form callback={() => setModalState('')} />}
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
