import Error from '../error/Error';
import Loader from '../loading/Loader';
import { FetchError } from '@/util/fetchData';

interface AsyncAwait {
  isLoading: boolean;
      error: FetchError | null;
   children: React.ReactNode;
}

export default function AsyncAwait({ isLoading, error, children }: AsyncAwait) {
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <>{children}</>
      )}
    </>
  );
}
