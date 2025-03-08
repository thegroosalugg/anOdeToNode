import { useCallback, useRef } from 'react';

export default function useInitial() {
  const initialRef = useRef(true);

  const mountData = useCallback(async <T>(req: () => Promise<T | void>) => {
    if (initialRef.current) {
      await req();
      initialRef.current = false;
    }
  }, []);

  const setInit = (value: boolean) => initialRef.current = value;

  return { isInitial: initialRef.current, mountData, setInit };
}
