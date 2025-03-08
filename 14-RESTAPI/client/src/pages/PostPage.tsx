import useFetch from '@/hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePagination from '@/hooks/usePagination';
import useSocket from '@/hooks/useSocket';
import { FetchError } from '@/util/fetchData';
import { Authorized } from './RootLayout';
import Post from '@/models/Post';
import Reply from '@/models/Reply';
import AsyncAwait from '@/components/panel/AsyncAwait';
import PostId from '@/components/post/PostId';
import Modal from '@/components/modal/Modal';
import PostForm from '@/components/form/PostForm';
import ConfirmDialog from '@/components/dialog/ConfirmDialog';
import SendMessage from '@/components/form/SendMessage';
import ReplyItem from '@/components/post/ReplyItem';
import PagedList from '@/components/pagination/PagedList';
import { captainsLog } from '@/util/captainsLog';


export default function PostPage({ user, setUser }: Authorized) {
  const {
          data: post,
       setData: setPost,
    reqHandler: reqPost,
     isLoading,
         error,
      setError,
  } = useFetch<Post | null>();
  const { postId } = useParams();
  const {
    fetcher: { setData: setReplies },
     ...rest
  } = usePagination<Reply>(`post/replies/${postId}`, !!postId);
  const [modalState, setModalState] = useState('');
  const   navigate  = useNavigate();
  const   socketRef = useSocket('POST');
  const   isInitial = useRef(true);
  const  closeModal = () => setModalState('');

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const fetchPost = async () => {
      if (postId && isInitial.current) {
        await reqPost({ url: `feed/find/${postId}` });
        isInitial.current = false;
      }
    }

    fetchPost();

    const col = 324;
    const log = 'SOCKET: 📬POSTPAGE';
    socket.on('connect', () => captainsLog(col, [`${log} [connected]`]));

    socket.on(`post:${postId}:reply:new`, (reply) => {
      captainsLog(col, [`${log} :reply:new`, reply]);
      setTimeout(() => {
        setReplies(({ docCount, items }) => {
          return { docCount: docCount + 1, items: [reply, ...items] };
        });
      }, 1200); // delay for other animations to act first
    });

    socket.on(`post:${postId}:reply:delete`, (deleted) => {
      captainsLog(col, [`${log} :reply:delete`, deleted]);
      setReplies(({ docCount: prevCount, items: prevReplies }) => {
        const    items = prevReplies.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        return { docCount, items };
      });
    });

    socket.on(`post:${postId}:update`, (post) => {
      captainsLog(col, [`${log} :post:update`, post]);
      setPost((prevPost) => {
        if (post) return { ...prevPost, ...post };
        return prevPost;
      });
      closeModal(); // viewers cannot open modals on this page
    });

    socket.on(`post:${postId}:delete`, (deleted) => {
      captainsLog(col, [`${log} :post:delete`, deleted]);
      if (deleted.creator !== user._id) {
        setPost(null); // delete actions for viewers. Creator's state automatically set to null
        setError({ message: 'The post was deleted' } as FetchError); // creators redirected without msg
      }
    });

    return () => {
      socket.off('connect');
      socket.off(`post:${postId}:reply:new`);
      socket.off(`post:${postId}:reply:delete`); // deletes a reply to post
      socket.off(`post:${postId}:update`);
      socket.off(`post:${postId}:delete`); // deletes the post (& all replies)
    };
  }, [socketRef, user._id, postId, setError, setPost, reqPost, setReplies]);

  async function deletePost() {
    await reqPost(
      { url: `post/delete/${postId}`, method: 'DELETE' },
      {
        onSuccess: () => {
          closeModal(); // delete actions for creator
          navigate('/feed');
        },
        onError: (err) => {
          if (err.status === 401) {
            setUser(null);
          }
          closeModal();
        }
      }
    );
  }

  return (
    <>
      <Modal show={modalState} close={closeModal}>
        {modalState ===  'edit'  && (
          <PostForm setUser={setUser} post={post} />
        )}
        {modalState === 'delete' && (
          <ConfirmDialog onConfirm={deletePost} onCancel={closeModal} />
        )}
      </Modal>
      <AsyncAwait {...{ isLoading, error }}>
        {post && (
          <>
            <PostId {...{ post, user }} setModal={setModalState} />
            <SendMessage {...{ url: `post/reply/${post._id}`, setUser, isPost: true }} />
            <PagedList<Reply> {...{ ...rest, config: 'reply' }}>
              {(reply) => <ReplyItem {...reply} userId={user._id} />}
            </PagedList>
          </>
        )}
      </AsyncAwait>
    </>
  );
}
