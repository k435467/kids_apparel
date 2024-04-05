import useSWR from 'swr'
import { fetcher } from '@/networks/network'
import { IDocCategory } from '@/types/database'

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
