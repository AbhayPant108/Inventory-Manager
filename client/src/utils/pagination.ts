import type { PaginationResult } from '@/types/api'

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  pageSize: number,
): PaginationResult<T> {
  const totalItems = items.length
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1)
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const startIndex = (safePage - 1) * pageSize

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize,
  }
}
