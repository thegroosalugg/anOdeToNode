import { captainsLog } from '@/util/captainsLog';
import fetchData, { Fetch, FetchError } from '@/util/fetchData';
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
    async (params: Fetch, config?: ReqConfig<T>): Promise<T | void> => {
      if (params.method) console.clear(); // **LOGDATA
      const { onSuccess, onError } = config || {};
      setIsLoading(true);
      try {
        const response: T = await fetchData(params);
        setData(response);
        captainsLog(-100, 340, ['USE FETCH TRY', response]); // **LOGDATA
        if (onSuccess) onSuccess(response);
        return response;
      } catch (err) {
        const fetchErr = err as FetchError;
        captainsLog(-100, 310, ['USE FETCH CATCH', fetchErr]); // **LOGDATA
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
