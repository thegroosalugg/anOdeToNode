import { useState } from 'react';
import { useDebounce } from './useDebounce';
import { Direction } from '../types/common';

export function usePages() {
  const { deferring,    deferFn } = useDebounce();
  const [currentPage,    setPage] = useState(1);
  const [direction, setDirection] = useState<Direction>(1)

  const changePage = (page: number) => {
    deferFn(() => {
      setPage(page);
      setDirection(page > currentPage ? 1 : -1);
    }, 500);
  };

  return { currentPage, direction, changePage, deferring };
}
