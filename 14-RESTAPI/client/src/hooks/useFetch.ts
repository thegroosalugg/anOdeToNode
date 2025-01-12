import { captainsLog } from '@/util/captainsLog';
import fetchData, { Fetch } from '@/util/fetchData';
import { useState, useCallback } from 'react';

export type FetchError = {
  [key: string]: string;
} & {
  message: string;
   status: number;
};

const useFetch = <T>(initialData: T = null as T) => {
  const [     data,      setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [    error,     setError] = useState<FetchError | null>(null);

  const reqHandler = useCallback(
    async (params: Fetch, callback?: (err: FetchError) => void) => {
      if (params.method) console.clear(); // **LOGDATA
      setIsLoading(true);
      try {
        const response = await fetchData(params);
        setData(response);
        captainsLog(-100, 340, ['USE FETCH TRY', response]); // **LOGDATA
        return response;
      } catch (err) {
        const fetchErr = err as FetchError;
        captainsLog(-100, 310, ['USE FETCH CATCH', fetchErr]); // **LOGDATA
        setError(fetchErr);
        setData(initialData); // clear out old data on latest requests
        if (callback) callback(fetchErr); // i.e. setData of other states
      } finally {
        setIsLoading(false);
      }
    },
    [initialData]
  );

  return { data, setData, isLoading, error, setError, reqHandler };
};

export default useFetch;
