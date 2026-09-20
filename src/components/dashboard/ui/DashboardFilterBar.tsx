"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/SearchInput";
import { Filter, RefreshCw, XCircle } from "lucide-react";

export interface FilterSelectConfig {
  key: string;
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  widthClass?: string;
}

export interface SortConfig {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  options: { label: string; value: string }[]; // value should be "field-asc" or "field-desc"
  placeholder?: string;
  widthClass?: string;
}

export interface DashboardFilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: FilterSelectConfig[];
  sort?: SortConfig;
  isFiltered: boolean;
  onReset: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

export function DashboardFilterBar({
  search,
  filters = [],
  sort,
  isFiltered,
  onReset,
  isFilterOpen,
  setIsFilterOpen,
}: DashboardFilterBarProps) {
  const getSortLabel = () => {
    if (!sort) return "";
    const currentVal = `${sort.sortBy}-${sort.sortOrder}`;
    const found = sort.options.find((opt) => opt.value === currentVal);
    return found ? found.label : (sort.placeholder || "Sort By");
  };

  return (
    <div className="flex flex-row gap-2 sm:gap-4 items-center">
      {/* Search Bar */}
      {search && (
        <SearchInput
          placeholder={search.placeholder || "অনুসন্ধান করুন..."}
          value={search.value}
          onChange={search.onChange}
        />
      )}

      {/* Filters & Sort Controls */}
      {(filters.length > 0 || sort) && (
        <div className="flex items-center gap-2 w-auto">
          {/* Mobile/Tablet Filter Drawer */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <Button
                variant="outline"
                className="w-auto gap-2 border-border hover:bg-cream hover:border-fire/30 hover:text-fire rounded-xl h-11 px-3 sm:px-4 transition-all"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {isFiltered && <span className="flex h-2 w-2 rounded-full bg-fire" />}
              </Button>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col" showCloseButton={false}>
                <SheetHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-fire" /> Filters
                  </SheetTitle>
                  <SheetClose className="rounded-xl p-2 hover:bg-cream dark:hover:bg-charcoal-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fire border border-transparent hover:border-fire/30">
                    <XCircle className="h-5 w-5 text-muted-foreground hover:text-fire" />
                  </SheetClose>
                </SheetHeader>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                  <SheetDescription className="sr-only">Filter and sort options</SheetDescription>

                  {/* Filter Options */}
                  {filters.map((filter) => (
                    <div key={filter.key} className="space-y-3">
                      {filter.label && (
                        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                          {filter.label}
                        </h3>
                      )}
                      <Select value={filter.value} onValueChange={(v) => filter.onChange(v || "all")}>
                        <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                          <SelectValue placeholder={filter.placeholder}>
                            {filter.value === "all"
                              ? filter.placeholder
                              : filter.options.find((o) => o.value === filter.value)?.label || filter.value}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {filter.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}

                  {/* Sort Option */}
                  {sort && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                        {sort.placeholder || "Sort By"}
                      </h3>
                      <Select
                        value={`${sort.sortBy}-${sort.sortOrder}`}
                        onValueChange={(v) => {
                          const [by, order] = (v || "createdAt-desc").split("-");
                          sort.onChange(by, order as "asc" | "desc");
                        }}
                      >
                        <SelectTrigger className="w-full h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl">
                          <SelectValue placeholder={sort.placeholder || "Sort By"}>{getSortLabel()}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {sort.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-border bg-cream/50 dark:bg-charcoal-light/30">
                  <Button
                    onClick={() => {
                      onReset();
                      setIsFilterOpen(false);
                    }}
                    variant="outline"
                    disabled={!isFiltered}
                    className="w-full h-12 rounded-xl border-border hover:bg-fire hover:text-white hover:border-fire transition-all font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Inline Filters */}
          <div className="hidden lg:flex flex-wrap gap-2 items-center">
            {filters.map((filter) => (
              <Select key={filter.key} value={filter.value} onValueChange={(v) => filter.onChange(v || "all")}>
                <SelectTrigger
                  className={`${
                    filter.widthClass || "w-[140px]"
                  } h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl`}
                >
                  <SelectValue placeholder={filter.placeholder}>
                    {filter.value === "all"
                      ? filter.placeholder
                      : filter.options.find((o) => o.value === filter.value)?.label || filter.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {sort && (
              <Select
                value={`${sort.sortBy}-${sort.sortOrder}`}
                onValueChange={(v) => {
                  const [by, order] = (v || "createdAt-desc").split("-");
                  sort.onChange(by, order as "asc" | "desc");
                }}
              >
                <SelectTrigger
                  className={`${
                    sort.widthClass || "w-[170px]"
                  } h-11 bg-background border-border focus:ring-fire/20 focus:border-fire/50 rounded-xl`}
                >
                  <SelectValue placeholder={sort.placeholder || "Sort By"}>{getSortLabel()}</SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {sort.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground hover:text-fire hover:bg-cream h-10 px-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
