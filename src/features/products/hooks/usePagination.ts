import { useCallback, useEffect, useMemo, useState } from 'react';
import { PAGINATION_CONFIG } from '@/constants/config';

interface UsePaginationResult<T> {
  visibleItems: T[];
  loadMore: () => void;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  isLoadingMore: boolean;
}

export const usePagination = <T>(
  items: T[],
  pageSize = PAGINATION_CONFIG.PAGE_SIZE,
  resetKey?: string | number,
): UsePaginationResult<T> => {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [resetKey, pageSize]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const visibleCount = Math.min(page * pageSize, items.length);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    requestAnimationFrame(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    });
  }, [hasMore, isLoadingMore]);

  return {
    visibleItems,
    loadMore,
    hasMore,
    currentPage: page,
    totalPages,
    totalItems: items.length,
    pageSize,
    isLoadingMore,
  };
};
