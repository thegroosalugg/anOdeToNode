import { AnimatePresence } from 'motion/react';
import { FetchError } from '@/lib/types/common';
import Error from './error/Error';
import Loader from './loader/Loader';

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
