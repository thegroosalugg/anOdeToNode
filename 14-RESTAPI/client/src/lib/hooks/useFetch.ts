import fetchData, { ApiError, Fetch } from '@/lib/http/fetchData';
import { useState, useCallback } from 'react';

interface ReqConfig<T> {
  onSuccess?: (res:     T     ) => void;
    onError?: (err: ApiError) => void;
}

export type ReqData<T> = (params: Fetch, config?: ReqConfig<T>) => Promise<T | void>;

export const useFetch = <T>(initialData: T = null as T, loading = false) => {
  const [     data,      setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(loading);
  const [    error,     setError] = useState<ApiError | null>(null);

  const reqData = useCallback(
    async (params: Fetch, config: ReqConfig<T> = {}): Promise<T | void> => {
      if (params.method) console.clear(); // **LOGDATA
      const { onSuccess, onError } = config;
      setIsLoading(true);
      try {
        const response: T = await fetchData(params);
        setData(response);
        if (onSuccess) onSuccess(response);
        return response;
      } catch (err) {
        const fetchErr = err as ApiError;
        setError(fetchErr);
        if (onError) onError(fetchErr); // i.e. setData of other states
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, setData, isLoading, error, setError, reqData };
};
