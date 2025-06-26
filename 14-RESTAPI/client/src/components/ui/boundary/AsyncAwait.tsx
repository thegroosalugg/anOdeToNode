import { AnimatePresence } from 'motion/react';
import Error from './error/Error';
import Loader from './loader/Loader';
import { FetchError } from '@/lib/util/fetchData';

interface AsyncAwait {
  isLoading: boolean;
      error: FetchError | null;
   children: React.ReactNode;
}

export default function AsyncAwait({ isLoading, error, children }: AsyncAwait) {
  return (
    <AnimatePresence mode='wait'>
      {isLoading ? (
        <Loader key='loader' />
      ) : error ? (
        <Error key='error' error={error} />
      ) : (
        <>{children}</>
      )}
    </AnimatePresence>
  );
}
