import { useEffect, useRef, useState } from 'react';
import useDebounce, { Debounce } from './useDebounce';
import useFetch from './useFetch';

export type     Pages = [previous: number, current: number];
export type Direction = 1 | -1;

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

export default function usePagination<T>(baseURL: string, shouldFetch = true) {
  const initState: InitState<T>       = { docCount: 0, items: [] };
  const { data, reqHandler, ...rest } = useFetch(initState);
  const            isInitial          = useRef(true);
  const { deferring,        deferFn } = useDebounce();
  const [pages,             setPages] = useState<Pages>([1, 1]);
  const [previous,           current] = pages;
  const direction: Direction          = previous < current ? 1 : -1;
  const              url              = baseURL + `?page=${current}`;

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

  const changePage = (page: number) => {
    deferFn(() => setPages([current, page]), 1200);
  };

  return {
       fetcher: { ...rest, isLoading: isInitial.current },
          data,
       current,
     direction,
    changePage,
     deferring,
  };
}
