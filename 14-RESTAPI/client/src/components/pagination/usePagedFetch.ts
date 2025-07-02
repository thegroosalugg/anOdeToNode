import { useEffect, useRef } from 'react';
import { useFetch } from '@/lib/hooks/useFetch';
import { usePages } from '@/lib/hooks/usePages';
import { Debounce } from "@/lib/hooks/useDebounce";
import { Direction } from '@/lib/types/common';

export type InitState<T> = {
  docCount: number;
     items: T[];
};

export type Paginated<T = null> = {
        data: InitState<T>;
  changePage: (page: number) => void;
       limit: number;
     current: number;
   direction: Direction;
   deferring: Debounce['deferring'];
};

export function usePagedFetch<T>(baseURL: string, limit: number, shouldFetch = true) {
  const initState: InitState<T> = { docCount: 0, items: [] };
  const { data, reqData, ...rest } = useFetch(initState);
  const   isInitial = useRef(true);
  const  pagedProps = usePages();
  const { current } = pagedProps;
  const     url     = baseURL + `?page=${current}&limit=${limit}`;

  useEffect(() => {
    const initData = async () => {
      // guard request with optional conditions to prevent FC dismount requests
      if (shouldFetch) {
        await reqData({ url }); // ref required to disable loaders on page swap after initial
        if (isInitial.current) isInitial.current = false;
      }
    }
    initData();
  }, [reqData, url, shouldFetch]);

  return { ...pagedProps, limit, data, fetcher: { ...rest, isLoading: isInitial.current } };
}
