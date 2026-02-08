import fetchData, { ApiError, Fetch } from "@/lib/http/fetchData";
import { useState, useCallback } from "react";
import { SetData } from "../types/common";

interface ReqDataProps<T> extends Fetch {
  onSuccess?: (res: NonNullable<T>) => void;
  onError?:   (err:       ApiError) => void;
}

export type ReqData<T> = (config: ReqDataProps<T>) => Promise<T | void>;

interface UseFetch<T> {
  isLoading: boolean;
      error:         ApiError | null;
   setError: SetData<ApiError | null>;
    reqData: ReqData<T>;
}

// Overload 1: initData provided → data is <T>
export function useFetch<T>(initData: T): UseFetch<T> & {
     data:         T;
  setData: SetData<T>;
};

// Overload 2: initData omitted → data is <T | null>
export function useFetch<T>(): UseFetch<T> & {
     data:         T | null;
  setData: SetData<T | null>;
};

export function useFetch<T>(initData?: T) {
  const [data,           setData] = useState<T | null>(initData ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,         setError] = useState<ApiError | null>(null);

  const reqData = useCallback(async (config: ReqDataProps<T>) => {
    const { onSuccess, onError, ...fetchConfig } = config;
    if (fetchConfig.method) console.clear(); // **LOGDATA
    setIsLoading(true);

    try {
      const response = await fetchData<T>(fetchConfig);
      setData(response);
      onSuccess?.(response);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      onError?.(apiError); // i.e. setData of other states
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, setData, reqData, isLoading, error, setError };
}
