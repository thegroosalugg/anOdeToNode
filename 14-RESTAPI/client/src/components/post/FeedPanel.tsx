import Post from '@/models/Post';
import Error from '../error/Error';
import Loader from '../loading/Loader';
import Pagination from '../pagination/Pagination';
import type { Paginated } from '../pagination/Pagination';
import PostFeed from './PostFeed';
import { FetchError } from '@/util/fetchData';

interface Feed extends Paginated<Post, 'posts'> {
   isLoading: boolean;
       error: FetchError | null;
  alternate?: boolean;
}

export default function FeedPanel({
      posts,
  isLoading,
      error,
   docCount,
      limit,
      pages,
   setPages,
  alternate,
}: Feed) {
  const paginateProps = { limit, docCount, pages, setPages };
  const     feedProps = { ...paginateProps, posts, alternate };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <PostFeed {...feedProps} />
      )}
      {docCount > 4 && (
        <Pagination {...paginateProps} />
      )}
    </>
  );
}
