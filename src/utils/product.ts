import { IGetProductsCondition } from '@/app/api/products/route'

export const makeGetProductsCondition = (
  search: URLSearchParams,
): Required<Omit<IGetProductsCondition, 'name' | 'startTime' | 'endTime'>> &
  Pick<IGetProductsCondition, 'name' | 'startTime' | 'endTime'> => ({
  name: search.get('name') ?? undefined,
  startTime: search.get('startTime') ?? undefined,
  endTime: search.get('endTime') ?? undefined,
  page: parseInt(search.get('page') ?? '1'),
  size: parseInt(search.get('size') ?? '10'),
  sort: search.get('sort') ?? '_id',
  asc: parseInt(search.get('asc') ?? '-1') as 1 | -1,
})
