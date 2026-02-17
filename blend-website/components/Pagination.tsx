"use client";

import { motion } from "framer-motion";

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  showControls?: boolean;
  maxVisible?: number;
};

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  className = "",
  buttonClassName = "",
  activeButtonClassName = "",
  showControls = true,
  maxVisible = 5,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalPages <= 1) return null;

  const safeCurrent = Math.min(Math.max(1, currentPage), totalPages);
  const siblingCount = Math.max(0, Math.floor((maxVisible - 3) / 2));

  const showLeftEllipsis = safeCurrent > 2 + siblingCount;
  const showRightEllipsis = safeCurrent < totalPages - (1 + siblingCount);

  let pages: (number | "ellipsis")[] = [];

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, 2 + siblingCount * 2);
    pages = [...leftRange, "ellipsis", totalPages];
  } else if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
    pages = [1, "ellipsis", ...rightRange];
  } else if (showLeftEllipsis && showRightEllipsis) {
    const middleRange = range(safeCurrent - siblingCount, safeCurrent + siblingCount);
    pages = [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
  } else {
    pages = range(1, totalPages);
  }

  const baseButton =
    "flex h-7 min-w-[28px] items-center justify-center rounded-full border border-black/10 text-[11px] font-semibold transition sm:h-6 sm:min-w-[24px] sm:text-xs";

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-1 ${className}`}>
      {showControls ? (
        <motion.button
          type="button"
          className={`${baseButton} bg-white text-black ${buttonClassName}`}
          onClick={() => onPageChange(safeCurrent - 1)}
          disabled={safeCurrent === 1}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          ‹
        </motion.button>
      ) : null}

      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-xs font-semibold text-black/50">
            …
          </span>
        ) : (
          <motion.button
            key={page}
            type="button"
            className={`${baseButton} ${
              page === safeCurrent ? `bg-[#22c55e] text-black ${activeButtonClassName}` : `bg-white text-black ${buttonClassName}`
            }`}
            onClick={() => onPageChange(page)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        )
      )}

      {showControls ? (
        <motion.button
          type="button"
          className={`${baseButton} bg-white text-black ${buttonClassName}`}
          onClick={() => onPageChange(safeCurrent + 1)}
          disabled={safeCurrent === totalPages}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          ›
        </motion.button>
      ) : null}
    </div>
  );
}
