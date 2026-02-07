import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { Debounce, useDebounce } from "@/lib/hooks/useDebounce";
import { Direction } from "@/lib/types/common";

export type InitState<T> = {
  docCount: number;
     items: T[];
};

export type Paginated<T = null> = {
         data: InitState<T>;
   changePage: (page: number) => void;
        limit: number;
  currentPage: number;
    direction: Direction;
    deferring: Debounce["deferring"];
};

export function usePagedFetch<T>(baseURL: string, limit: number, shouldFetch = true) {
  const initState: InitState<T>         = { docCount: 0, items: [] };
  const { data,    reqData,   ...rest } = useFetch(initState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [direction,       setDirection] = useState<Direction>(1)
  const { deferring,          deferFn } = useDebounce();
  const isInitial = useRef(true);

  const currentPage = +(searchParams.get("page") ?? 1);
  const url = `${baseURL}?page=${currentPage}&limit=${limit}`;

  function changePage(nextPage: number) {
    deferFn(() => {
      setSearchParams({ page: String(nextPage) });
      setDirection(nextPage > currentPage ? 1 : -1);
    }, 500);
  }

  useEffect(() => {
    if (!shouldFetch) return;

    reqData({ url }).finally(() => {
      if (isInitial.current) isInitial.current = false; // loader only on initial render; thereafter disabled
    });
  }, [url, shouldFetch, reqData]);

  return { ...rest, data, limit, currentPage, direction, changePage, deferring, isLoading: isInitial.current };
}
