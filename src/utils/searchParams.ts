import type { IPagination } from '@/hooks/usePagination'
import type { IProductFilter } from '@/hooks/useProductFilter'

export const makePaginationAndValidate = (search: URLSearchParams): IPagination => {
  const pagination = {
    current: parseInt(search.get('current') ?? '1'),
    pageSize: parseInt(search.get('pageSize') ?? '10'),
  }
  if (pagination.current < 1 || pagination.pageSize > 30) {
    throw new Error('Pagination is invalid.')
  }
  return pagination
}

export const makeProductFilter = (search: URLSearchParams): IProductFilter => ({
  asc: parseInt(search.get('asc') ?? '-1') as IProductFilter['asc'],
  endTime: search.get('endTime') ?? undefined,
  name: search.get('name') ?? undefined,
  sort: search.get('sort') ?? '_id',
  startTime: search.get('startTime') ?? undefined,
})
