/**
 * Deprecated
 * See ../networks
 */
import useSWR from 'swr'

export const fetcher = (input: string | URL | globalThis.Request, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json())
export const useProduct = (productId: string) =>
  useSWR<IProduct>(`/api/products/${productId}`, fetcher)
export const useCart = () =>
  useSWR<ICartResponse<string>>('/api/cart', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })
