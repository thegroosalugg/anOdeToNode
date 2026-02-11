import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetch } from "@/lib/hooks/useFetch";
import { Direction } from "@/lib/types/common";
import { ApiUrl } from "@/lib/http/fetchData";

export type InitState<T> = {
  docCount: number;
     items: T[];
};

export type Paginated<T = null> = {
         data: InitState<T>;
    isLoading: boolean;
        limit: number;
  currentPage: number;
   changePage: (page: number) => void;
    direction: Direction;
};

export function usePagedFetch<T>(apiURL: ApiUrl, limit: number, shouldFetch = true) {
  const initState: InitState<T>               = { docCount: 0, items: [] };
  const { data, isLoading, reqData, ...rest } = useFetch(initState);
  const [searchParams,       setSearchParams] = useSearchParams();
  const [direction,             setDirection] = useState<Direction>(1)

  const currentPage = +(searchParams.get("page") ?? 1);
  const url = `${apiURL}?page=${currentPage}&limit=${limit}`;

  function changePage(nextPage: number) {
    if (isLoading) return; // deferring tied to request progress state
    setSearchParams({ page: String(nextPage) });
    setDirection(nextPage > currentPage ? 1 : -1);
  }

  useEffect(() => {
    if (shouldFetch) reqData({ url });
  }, [url, shouldFetch, reqData]);

  return {
        ...rest,
           data,
      isLoading,
          limit,
    currentPage,
     changePage,
      direction,
  };
}
