import { useState, useMemo } from 'react';

export function usePagination(initialPage = 1, defaultLimit = 10, totalItems = 0) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(defaultLimit);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / limit));
  }, [totalItems, limit]);

  const nextPage = () => {
    setPage((p) => Math.min(p + 1, totalPages));
  };

  const prevPage = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const goToPage = (p: number) => {
    const pageNumber = Math.max(1, Math.min(p, totalPages));
    setPage(pageNumber);
  };

  return {
    page,
    limit,
    totalItems,
    totalPages,
    setPage: goToPage,
    setLimit,
    nextPage,
    prevPage,
  };
}
