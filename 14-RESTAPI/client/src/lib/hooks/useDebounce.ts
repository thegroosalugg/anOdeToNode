import { useState } from "react";

export type DeferFn = (callback: () => void, timeout: number) => void;

export type Debounce = {
  deferring: boolean;
    deferFn: DeferFn;
};

export function useDebounce() {
  const [deferring, setDeferring] = useState(false);

  const deferFn = async (callback: () => void, timeout: number) => {
    if (deferring) return;
    setDeferring(true);
    callback();
    setTimeout(() => {
      setDeferring(false);
    }, timeout);
  };

  return { deferring, deferFn };
}
