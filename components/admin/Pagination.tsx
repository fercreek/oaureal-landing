'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  basePath: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  totalItems,
  limit,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const pageNumbers: number[] = [];
  const showPages = 5;
  let from = Math.max(1, currentPage - Math.floor(showPages / 2));
  const to = Math.min(totalPages, from + showPages - 1);
  if (to - from + 1 < showPages) from = Math.max(1, to - showPages + 1);
  for (let i = from; i <= to; i++) pageNumbers.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
      <p className="text-text-muted text-sm font-body order-2 sm:order-1">
        Mostrando {start}–{end} de {totalItems}
      </p>
      <nav className="flex items-center gap-1 order-1 sm:order-2" aria-label="Paginación">
        {prevPage ? (
          <Link
            href={prevPage === 1 ? basePath : `${basePath}?page=${prevPage}`}
            className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-white/10 transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft size={20} />
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-text-muted/50 cursor-not-allowed" aria-hidden>
            <ChevronLeft size={20} />
          </span>
        )}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((num) =>
            num === currentPage ? (
              <span
                key={num}
                className="min-w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-bg font-subtitle font-bold text-sm"
                aria-current="page"
              >
                {num}
              </span>
            ) : (
              <Link
                key={num}
                href={num === 1 ? basePath : `${basePath}?page=${num}`}
                className="min-w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-primary hover:bg-white/10 font-subtitle text-sm transition-colors"
              >
                {num}
              </Link>
            )
          )}
        </div>
        {nextPage ? (
          <Link
            href={`${basePath}?page=${nextPage}`}
            className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-white/10 transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight size={20} />
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-text-muted/50 cursor-not-allowed" aria-hidden>
            <ChevronRight size={20} />
          </span>
        )}
      </nav>
    </div>
  );
}
