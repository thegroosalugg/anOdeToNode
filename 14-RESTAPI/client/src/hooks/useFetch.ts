import { captainsLog } from '@/util/captainsLog';
import fetchData, { Fetch } from '@/util/fetchData';
import { useState, useCallback } from 'react';

export type FetchError  = {
  [key: string]: string | number;
}

const useFetch = <T>(initialData: T | null = null) => {
  const [     data,      setData] = useState<T>(initialData as T);
  const [isLoading, setIsLoading] = useState(false);
  const [    error,     setError] = useState<FetchError | null>(null);

  const reqHandler = useCallback(async (params: Fetch) => {
    if (params.method) console.clear(); // **LOGDATA
    setIsLoading(true);
    try {
      const response = await fetchData(params);
      setData(response);
      captainsLog(-100, 340, ['USE FETCH RES', response]); // **LOGDATA
      return response;
    } catch (err) {
      captainsLog(-100, 310, ['USE FETCH CATCH', err]); // **LOGDATA
      setError(err as FetchError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, setData, isLoading, error, setError, reqHandler };
};

export default useFetch;
