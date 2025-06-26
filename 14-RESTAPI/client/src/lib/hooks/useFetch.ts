import fetchData, { Fetch, FetchError } from '@/lib/util/fetchData';
import { useState, useCallback } from 'react';

export interface ReqConfig<T> {
  onSuccess?: (res:     T     ) => void;
    onError?: (err: FetchError) => void;
}

const useFetch = <T>(initialData: T = null as T, loading = false) => {
  const [     data,      setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(loading);
  const [    error,     setError] = useState<FetchError | null>(null);

  const reqHandler = useCallback(
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
        const fetchErr = err as FetchError;
        setError(fetchErr);
        if (onError) onError(fetchErr); // i.e. setData of other states
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, setData, isLoading, error, setError, reqHandler };
};

export default useFetch;
