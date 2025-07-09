import { useState } from 'react';
import { useDebounce } from './useDebounce';
import { Direction } from '../types/common';

export const custom = ({
   enter: (direction: Direction) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0 },
    exit: (direction: Direction) => ({ opacity: 0, x: direction < 0 ? 50 : -50 }),
});

export function usePages() {
  const { deferring,    deferFn } = useDebounce();
  const [current,        setPage] = useState(1);
  const [direction, setDirection] = useState<Direction>(1)

  const changePage = (page: number) => {
    deferFn(() => {
      setPage(page);
      setDirection(page > current ? 1 : -1);
    }, 500);
  };

  return { current, direction, changePage, deferring };
}
