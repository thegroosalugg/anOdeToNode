import useFetch from '@/hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BASE_URL, FetchError } from '@/util/fetchData';
import { Authorized } from './RootLayout';
import { Pages, Paginated } from '@/components/pagination/Pagination';
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

const initialData: Paginated<Reply, 'replies'> = {
  docCount: 0,
   replies: [],
};

export default function PostPage({ user, setUser }: Authorized) {
  const {
          data: post,
       setData: setPost,
    reqHandler: reqPost,
     isLoading,
         error,
      setError,
  } = useFetch<Post | null>();
  const {
          data: { docCount, replies },
       setData: setReplies,
    reqHandler: reqReplies,
  } = useFetch(initialData);
  const [modalState, setModalState] = useState('');
  const [pages,           setPages] = useState<Pages>([1, 1]);
  const [,                 current] = pages;
  const   navigate = useNavigate();
  const { postId } = useParams();
  const  isInitial = useRef(true);
  const closeModal = () => setModalState('');
  const replyProps = { type: 'reply' as const, items: replies, docCount, pages, setPages };

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        await reqPost({ url: `feed/find/${postId}` });
        captainsLog([-100, 160], ['📬 POSTPAGE fetchPost']); // **LOGDATA
      }
    }

    const fetchReplies = async () => {
      if (postId) {
        await reqReplies({ url: `post/replies/${postId}?page=${current}` });
        captainsLog([-100, 170], ['📬 POSTPAGE fetchReplies']); // **LOGDATA
      }
    }

    const initialData = async () => await Promise.all([fetchPost(), fetchReplies()]);
    if (isInitial.current) {
      isInitial.current = false;
      initialData();
    } else {
      fetchReplies();
    }

    const socket = io(BASE_URL);
    socket.on('connect', () => captainsLog([-100, 164], ['📬 POSTPAGE: Socket connected']));

    socket.on(`post:${postId}:reply:new`, (reply) => {
      captainsLog([-100, 168], ['📬 POSTPAGE: NEW REPLY']);
      setTimeout(() => {
        setReplies(({ docCount, replies }) => {
          return { docCount: docCount + 1, replies: [reply, ...replies] };
        });
      }, 1200); // delay for other animations to act first
    });

    socket.on(`post:${postId}:reply:delete`, (deleted) => {
      setReplies(({ docCount: prevCount, replies: prevReplies }) => {
        const  replies = prevReplies.filter(({ _id }) => _id !== deleted._id);
        const docCount = prevCount - 1;
        captainsLog([-100, 172], ['📬 POSTPAGE: REPLY DELETED', deleted]);
        return { docCount, replies };
      });
    });

    socket.on(`post:${postId}:update`, (post) => {
      captainsLog([-100, 176], ['📬 POSTPAGE: POST UPDATED']);
      setPost((prevPost) => {
        if (post) return { ...prevPost, ...post };
        return prevPost;
      });
      closeModal(); // viewers cannot open modals on this page
    });

    socket.on(`post:${postId}:delete`, (deleted) => {
      captainsLog([-100, 180], ['POSTPAGE: POST DELETED']);
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
      socket.disconnect();
      captainsLog([-1, 160], ['📬 POSTPAGE disconnect']); // **LOGDATA
    };
  }, [user._id, postId, current, setError, setPost, reqPost, reqReplies, setReplies]);

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
            <SendMessage {...{ url: `post/reply/${post._id}`, setUser }} />
            <PagedList<Reply> {...replyProps}>
              {(reply) => <ReplyItem {...reply} userId={user._id} />}
            </PagedList>
          </>
        )}
      </AsyncAwait>
    </>
  );
}
