import { useState } from "react";

export type Defer = (callback: () => void, timeout: number) => void;

export type UseDefer = {
  deferring: boolean;
      defer: Defer;
};

export function useDefer() {
  const [deferring, setDeferring] = useState(false);

  const defer = async (callback: () => void, timeout: number) => {
    if (deferring) return;
    setDeferring(true);
    callback();
    setTimeout(() => {
      setDeferring(false);
    }, timeout);
  };

  return { deferring, defer };
}
