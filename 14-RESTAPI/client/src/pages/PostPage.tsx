import useFetch from '@/hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BASE_URL } from '@/util/fetchData';
import { Auth } from './RootLayout';
import Post from '@/models/Post';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PostId from '@/components/post/PostId';
import Modal from '@/components/modal/Modal';
import PostForm from '@/components/form/PostForm';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import ReplySubmit from '@/components/post/ReplySubmit';
import Replies from '@/components/post/Replies';
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

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog(-100, 25, ['POSTPAGE: Socket connected']));

    socket.on(`post:${postId}:reply`, (reply) => {
      captainsLog(-100, 20, ['POSTPAGE: NEW REPLY']);
      setPost((post) => {
        if (post) return { ...post, replies: [reply, ...post.replies] };
        return post;
      });
    });

    return () => {
      socket.off('connect');
      socket.off(`post:${postId}:reply`);
      socket.disconnect();
    };
  }, [postId, setPost, reqHandler]);

  function updatePost(post: Post | null) {
    setPost((prevPost) => prevPost ? { ...prevPost, ...post } : post);
    setModalState('');
  }

  async function deletePost() {
    setModalState('');
    await reqHandler(
      { url: `post/delete/${postId}`, method: 'DELETE' },
      { onSuccess: () => navigate('/') },
    );
  }

  const closeModal = () => setModalState('');

  return (
    <>
      <Modal show={modalState} close={closeModal}>
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
             onCancel={closeModal}
          />
        )}
      </Modal>
      <AsyncAwait {...{ isLoading, error }}>
        {post && (
          <>
            <PostId {...{ post, user }} setModal={setModalState} />
            {user && <ReplySubmit postId={post._id} />}
            <Replies replies={post.replies} />
          </>
        )}
      </AsyncAwait>
    </>
  );
}
