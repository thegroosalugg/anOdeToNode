import useFetch from '@/hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Auth } from './RootLayout';
import Post from '@/models/Post';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PostId from '@/components/post/PostId';
import Modal from '@/components/modal/Modal';
import PostForm from '@/components/form/PostForm';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import ReplySubmit from '@/components/post/ReplySubmit';
import { captainsLog } from '@/util/captainsLog';

export default function PostPage({ user, setUser }: Auth) {
  const   navigate = useNavigate();
  const { postId } = useParams();
  const { data: post, setData: setPost, reqHandler, isLoading, error } = useFetch<Post | null>();
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

  function updatePost(post: Post | null) {
    setPost(post);
    setModalState('');
  }

  async function deletePost() {
    setModalState('');
    await reqHandler(
      { url: `post/delete/${postId}`, method: 'DELETE' },
      { onSuccess: () => navigate('/') },
    );
  }

  return (
    <>
      <Modal show={modalState} close={() => setModalState('')}>
        {modalState ===  'edit'  && (
          <PostForm
            onSuccess={updatePost}
              setUser={setUser}
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
      <AsyncAwait {...{ isLoading, error }}>
        {post && <PostId {...{post, user}} setModal={setModalState} />}
      </AsyncAwait>
      {postId && user && <ReplySubmit {...{postId}} />}
    </>
  );
}
