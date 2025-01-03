import useFetch from '@/hooks/useFetch';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '@/models/Post';
import Loader from '@/components/loading/Loader';
import PostId from '@/components/post/PostId';
import Error from '@/components/error/Error';

export default function PostPage() {
  const { postId } = useParams();
  const { data: post, isLoading, error, reqHandler } = useFetch<Post | null>(null, true);

  useEffect(() => {
    const fetchPost = async () => reqHandler({ url: `feed/post/${postId}` });
    fetchPost();
  }, [postId, reqHandler]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <PostId post={post!} /> // post guaranteed true if isLoading/error false
      )}
    </>
  );
}
