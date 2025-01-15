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
  const {
          data: post,
       setData: setPost,
    reqHandler,
     isLoading,
         error,
      setError,
  } = useFetch<Post | null>();
  const [modalState, setModalState] = useState('');
  const   navigate = useNavigate();
  const { postId } = useParams();
  const  isInitial = useRef(true);
  const closeModal = () => setModalState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) await reqHandler({ url: `feed/find/${postId}` });
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

    socket.on(`post:${postId}:update`, (post) => {
      captainsLog(-100, 15, ['POSTPAGE: POST UPDATED']);
      setPost((prevPost) => {
        if (post) return { ...prevPost, ...post };
        return prevPost;
      });
      closeModal(); // viewers cannot open modals on this page
    });

    socket.on(`post:${postId}:delete`, (deleted) => {
      captainsLog(-100, 10, ['POSTPAGE: POST DELETED']);
      if (deleted.creator !== user?._id) {
        setPost(null); // delete actions for viewers. Creator's state automatically set to null
        setError({ message: 'The post was deleted' }); // creators redirected without msg
      }
    });

    return () => {
      socket.off('connect');
      socket.off(`post:${postId}:reply`);
      socket.off(`post:${postId}:update`);
      socket.off(`post:${postId}:delete`);
      socket.disconnect();
    };
  }, [user?._id, postId, setPost, setError, reqHandler]);

  async function deletePost() {
    await reqHandler(
      { url: `post/delete/${postId}`, method: 'DELETE' },
      {
        onSuccess: () => {
          closeModal(); // delete actions for creator
          navigate('/');
        },
      }
    );
  }

  return (
    <>
      <Modal show={modalState} close={closeModal}>
        {modalState ===  'edit'  && (
          <PostForm
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
