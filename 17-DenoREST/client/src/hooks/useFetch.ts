import { Fetch, fetchData, FetchError } from '@/util/fetchData';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export type SetData<T> = Dispatch<SetStateAction<T>>;
export interface ReqConfig<T> {
  onSuccess?: (res: T         ) => void;
    onError?: (err: FetchError) => void;
}

export const useFetch = <T = null>(initData: T = null as T) => {
  const [data,           setData] = useState(initData);
  const [isLoading, setIsLoading] = useState(false);
  const [error,         setError] = useState<FetchError | null>(null);

  const reqHandler = useCallback(
    async (params: Fetch, config: ReqConfig<T> = {}): Promise<T | void> => {
      const { onSuccess, onError } = config;
      setIsLoading(true);
      try {
        const response = await fetchData(params);
        setData(response);
        if (onSuccess) onSuccess(response);
        return response;
      } catch (error) {
        const fetchErr = error as FetchError;
        setError(fetchErr);
        if (onError) onError(fetchErr);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, setData, error, setError, isLoading, reqHandler };
};
