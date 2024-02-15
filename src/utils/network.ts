import useSWR from 'swr'

export const fetcher = (input: string | URL | globalThis.Request, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json())

export const useCategories = () => {
  const { data, error, isLoading } = useSWR<ICategory[]>('/api/categories', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  return {
    categories: data ?? [],
    error,
    isLoading,
  }
}

export const useHomePageProducts = () => {
  const { data, error, isLoading } = useSWR<IProduct[]>('/api/products/home-page', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  return {
    products: data ?? [],
    error,
    isLoading,
  }
}

export const useCategoryProducts = (categoryId: string) => {
  const { data, error, isLoading } = useSWR<IProduct[]>(
    `/api/categories/${categoryId}/products`,
    fetcher,
  )

  return {
    products: data ?? [],
    error,
    isLoading,
  }
}

export const useProductTotalCount = () => {
  const { data, error, isLoading } = useSWR<number>('/api/products/count', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  return {
    productTotalCount: data ?? 0,
    error,
    isLoading,
  }
}

export const useProduct = (productId: string) => {
  const { data, error, isLoading } = useSWR<IProduct>(`/api/products/${productId}`, fetcher)

  return {
    product: data ?? null,
    error,
    isLoading,
  }
}

export const useUsersCount = () => {
  const { data, error, isLoading } = useSWR<number>('/api/users/count', fetcher)

  return {
    usersTotalCount: data ?? 0,
    error,
    isLoading,
  }
}

export const useUsers = (page: string = '1') => {
  const { data, error, isLoading } = useSWR<
    {
      _id: string
      phoneNumber: string
      userName: string
      createTime: string
      role: string
    }[]
  >(`/api/member/users?page=${page}`, fetcher)

  return {
    users: data ?? [],
    error,
    isLoading,
  }
}
