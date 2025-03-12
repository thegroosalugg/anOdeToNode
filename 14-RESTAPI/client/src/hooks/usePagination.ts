import { useEffect, useRef, useState } from 'react';
import useDebounce, { Debounce } from './useDebounce';
import useFetch from './useFetch';

type Direction = -1 | 1;

export type InitState<T> = {
  docCount: number;
     items: T[];
};

export type Paginated<T = null> = {
        data: InitState<T>;
  changePage: (page: number) => void;
     current: number;
   direction: Direction;
   deferring: Debounce['deferring'];
};

export function usePages() {
  const { deferring,    deferFn } = useDebounce();
  const [current,        setPage] = useState(1);
  const [direction, setDirection] = useState<Direction>(1)

  const changePage = (page: number) => {
    deferFn(() => {
      setPage(page);
      setDirection(page > current ? 1 : -1);
    }, 1200);
  };

  return { current, direction, changePage, deferring };
}

export default function usePagination<T>(baseURL: string, shouldFetch = true) {
  const initState: InitState<T>       = { docCount: 0, items: [] };
  const { data, reqHandler, ...rest } = useFetch(initState);
  const   isInitial = useRef(true);
  const  pagedProps = usePages();
  const { current } = pagedProps;
  const     url     = baseURL + `?page=${current}`;

  useEffect(() => {
    const initData = async () => {
      // guard request with optional conditions to prevent FC dismount requests
      if (shouldFetch) {
        await reqHandler({ url });
        if (isInitial.current) isInitial.current = false;
      }
    }
    initData();
  }, [reqHandler, url, shouldFetch]);

  return { ...pagedProps, fetcher: { ...rest, isLoading: isInitial.current }, data };
}
