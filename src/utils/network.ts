/**
 * Deprecated
 * See ../networks
 */
import useSWR from 'swr'

export const fetcher = (input: string | URL | globalThis.Request, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json())
export const useHomePageProducts = () =>
  useSWR<IProduct[]>('/api/products/home-page', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

export const useCategoryProducts = (categoryId: string) =>
  useSWR<IProduct[]>(`/api/categories/${categoryId}/products`, fetcher)
export const useProduct = (productId: string) =>
  useSWR<IProduct>(`/api/products/${productId}`, fetcher)
export const useCart = () =>
  useSWR<ICartResponse<string>>('/api/cart', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

export const useOrders = () =>
  useSWR<IOrderWithProductData<string, string>[]>('/api/orders', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })
