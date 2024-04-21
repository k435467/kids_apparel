import useSWR from 'swr'
import { fetcher } from '@/networks/network'
import { IGetProductsRes } from '@/app/api/products/route'
import qs from 'query-string'
import { IProductFilter } from '@/hooks/useProductFilter'
import { IPagination } from '@/hooks/usePagination'

export const useProducts = (pagination: IPagination, filter?: IProductFilter) => {
  const q = qs.stringify({ ...filter, pagination })
  return useSWR<IGetProductsRes>(`/api/products?${q}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })
}
