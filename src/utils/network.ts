import useSWR from 'swr'

export const fetcher = (input: string | URL | globalThis.Request, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json())

export const useCategories = () =>
  useSWR<ICategory[]>('/api/categories', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

export const useHomePageProducts = () =>
  useSWR<IProduct[]>('/api/products/home-page', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

export const useCategoryProducts = (categoryId: string) =>
  useSWR<IProduct[]>(`/api/categories/${categoryId}/products`, fetcher)

export const useProductTotalCount = () =>
  useSWR<number>('/api/products/count', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

export const useProducts = (page: number) =>
  useSWR<IProduct[]>(`/api/products?page=${page}`, fetcher)

export const useProduct = (productId: string) =>
  useSWR<IProduct>(`/api/products/${productId}`, fetcher)
export const useUsersCount = () => useSWR<number>('/api/users/count', fetcher)

export const useUsers = (page: string = '1') =>
  useSWR<
    {
      _id: string
      phoneNumber: string
      userName: string
      createTime: string
      role: string
    }[]
  >(`/api/member/users?page=${page}`, fetcher)

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
