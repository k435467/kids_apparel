import useSWR from 'swr'
import { fetcher } from '@/networks/network'
import { IDocCategory } from '@/types/database'
import qs from 'query-string'
import { IGetProductsCondition } from '@/app/api/products/route'
import { IGetCategoryProductsResponse } from '@/app/api/categories/[categoryId]/products/route'

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

export const useCategoryProducts = (categoryId: string, condition: IGetProductsCondition) =>
  useSWR<IGetCategoryProductsResponse>(
    `/api/categories/${categoryId}/products?${qs.stringify(condition)}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    },
  )
