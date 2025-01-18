import { useState } from 'react';

type DeferFn = (callback: () => void | Promise<void>, timeout: number) => void;

export type Debounce = {
  deferring: boolean;
    deferFn: DeferFn;
};

export default function useDebounce() {
  const [deferring, setDeferring] = useState(false);

  const deferFn: DeferFn = async (callback, timeout) => {
    if (!deferring) {
      setDeferring(true);
      await callback();

      setTimeout(() => {
        setDeferring(false);
      }, timeout);
    }
  };

  return { deferring, deferFn };
}
