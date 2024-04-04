import useSWR from 'swr'
import { fetcher } from '@/networks/network'
import { IGetProductsCondition, IGetProductsRes } from '@/app/api/products/route'
import qs from 'query-string'

export const useProducts = (condition: IGetProductsCondition) => {
  const q = qs.stringify(condition)
  return useSWR<IGetProductsRes>(`/api/products?${q}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })
}
