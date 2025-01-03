import fetchData, { Fetch } from '@/util/fetchData';
import { useState, useCallback } from 'react';

export type FetchError  = {
        message: string;
         status: number;
  [key: string]: string | number;
}

// optional loading set to true for GET reqs ensures Loader is returned first
const useFetch = <T>(initialData: T, loading: boolean = false) => {
  const [     data,      setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(loading);
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

  return { data, setData, isLoading, error, reqHandler };
};

export default useFetch;
