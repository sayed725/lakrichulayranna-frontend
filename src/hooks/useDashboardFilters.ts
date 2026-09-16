"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface UseDashboardFiltersOptions {
  initialSearch?: string;
  initialPage?: number;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
  debounceMs?: number;
}

export function useDashboardFilters(options: UseDashboardFiltersOptions = {}) {
  const {
    initialSearch = "",
    initialPage = 1,
    initialSortBy = "createdAt",
    initialSortOrder = "desc",
    debounceMs = 500,
  } = options;

  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, debounceMs);

  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setPage(1);
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
  };

  return {
    search,
    setSearch: handleSearchChange,
    debouncedSearch,
    page,
    setPage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleSortChange,
    resetFilters,
  };
}
