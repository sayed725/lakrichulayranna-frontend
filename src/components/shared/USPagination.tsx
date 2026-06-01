import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface USPaginationProps {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

export default function USPagination({
  page,
  totalPage,
  onPageChange,
}: USPaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPage > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (page <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPage);
    } else if (page >= totalPage - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPage - 4; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = page - 1; i <= page + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPage);
    }

    return pages;
  };

  return (
    <Pagination className="w-full justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className={
              page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10"
            }
          />
        </PaginationItem>

        {getPageNumbers().map((p, index) =>
          p === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={page === p}
                onClick={() => onPageChange(p as number)}
                className="cursor-pointer hover:bg-primary/10"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPage, page + 1))}
            className={
              page === totalPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer hover:bg-primary/10"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
