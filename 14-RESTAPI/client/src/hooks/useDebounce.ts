import { useState } from 'react';

export default function useDebounce() {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const throttleFn = (callback: () => void, timeout: number) => {
    if (!isDebouncing) {
      setIsDebouncing(true);
      callback();

      setTimeout(() => {
        setIsDebouncing(false);
      }, timeout);
    }
  }


  return { isDebouncing, throttleFn }
}
