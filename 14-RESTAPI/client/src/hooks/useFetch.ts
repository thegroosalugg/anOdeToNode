import fetchData, { Fetch } from '@/util/fetchData';
import { useState, useCallback } from 'react';

export type FetchError  = {
  [key: string]: string;
}

const useFetch = <T>(initialData?: T) => {
  const [     data,      setData] = useState<T>(initialData as T);
  const [isLoading, setIsLoading] = useState(false);
  const [    error,     setError] = useState<FetchError | null>(null);

  const reqHandler = useCallback(async (params: Fetch) => {
    setIsLoading(true);
    try {
      const response = await fetchData(params);
      setData(response);
      return response;
    } catch (err) {
      setError(err as FetchError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, setData, isLoading, error, setError, reqHandler };
};

export default useFetch;
