import { useState } from 'react';
import { useDebounce } from './useDebounce';
import { Direction } from '../types/common';

export function usePages() {
  const { deferring,    deferFn } = useDebounce();
  const [currentPage,    setPage] = useState(1);
  const [direction, setDirection] = useState<Direction>(1)

  const setPageDirection = (page: number) => {
    deferFn(() => {
      setPage(page);
      setDirection(page > currentPage ? 1 : -1);
    }, 500);
  };

  function createArraySlice<T>(arr: T[], page: number, limit: number): T[] {
    const start = (page - 1) * limit;
    return arr.slice(start, start + limit);
  }

  return { currentPage, direction, setPageDirection, createArraySlice, deferring };
}
