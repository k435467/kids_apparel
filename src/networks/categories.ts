import useSWR from 'swr'
import { fetcher } from '@/networks/network'
import { IDocCategory } from '@/types/database'
import qs from 'query-string'
import { IGetCategoryProductsResponse } from '@/app/api/categories/[categoryId]/products/route'
import { IPagination } from '@/hooks/usePagination'
import { IProductFilter } from '@/hooks/useProductFilter'

export const useCategories = () =>
  useSWR<IDocCategory[]>('/api/categories', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

export const useCategory = (categoryId: string) =>
  useSWR<IDocCategory>(`/api/categories/${categoryId}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

export const useCategoryProducts = (
  categoryId: string,
  pagination: IPagination,
  productFilter: IProductFilter,
) =>
  useSWR<IGetCategoryProductsResponse>(
    `/api/categories/${categoryId}/products?${qs.stringify({ ...pagination, ...productFilter })}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  )
