import useFetch from '@/hooks/useFetch';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '@/models/Post';
import Loader from '@/components/loading/Loader';
import PostId from '@/components/post/PostId';

export default function PostPage() {
  const { postId } = useParams();
  const { data: post, isLoading, error, reqHandler } = useFetch<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => reqHandler({ url: `feed/post/${postId}` });
    fetchPost();
  }, [postId, reqHandler]);

  console.log('data', post);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        post && <PostId post={post} />
      )}
    </>
  );
}
