import fetchData, { Fetch } from '@/util/fetchData';
import { useState, useCallback } from 'react';

const useFetch = () => {
  const [     data,      setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [    error,     setError] = useState<unknown | null>(null);

  const reqHandler = useCallback(async (params: Fetch) => {
    setIsLoading(true);
    try {
      const response = await fetchData(params);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, reqHandler };
};

export default useFetch;
