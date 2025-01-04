import useFetch from '@/hooks/useFetch';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '@/models/Post';
import User from '@/models/User';
import Loader from '@/components/loading/Loader';
import PostId from '@/components/post/PostId';
import Error from '@/components/error/Error';

export default function PostPage() {
  const { postId } = useParams();
  const { data: post, reqHandler, isLoading, error } = useFetch<Post | null>(null, true);
  const { data: user, reqHandler: fetchUser        } = useFetch<User | null>(null, true);

  useEffect(() => {
    const fetchPost = async () => {
      await Promise.all([
         fetchUser({ url: 'login' }),
        reqHandler({ url: `feed/post/${postId}` })
      ]);
    }
    fetchPost();
  }, [postId, reqHandler, fetchUser]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <PostId post={post!} user={user} /> // post guaranteed true if isLoading/error false
      )}
    </>
  );
}
