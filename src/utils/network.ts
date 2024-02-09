import useSWR from 'swr'

export const fetcher = (input: string | URL | globalThis.Request, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json())

export const useCategories = () => {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  return {
    categories: (data as ICategory[]) ?? [],
    error,
    isLoading,
  }
}

export const useHomePageProducts = () => {
  const { data, error, isLoading } = useSWR('/api/products/home-page', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  return {
    products: (data as IProduct[]) ?? [],
    error,
    isLoading,
  }
}

export const useCategoryProducts = (categoryId: string) => {
  const { data, error, isLoading } = useSWR(`/api/categories/${categoryId}/products`, fetcher)

  return {
    products: (data as IProduct[]) ?? [],
    error,
    isLoading,
  }
}

export const useProductTotalCount = () => {
  const { data, error, isLoading } = useSWR('/api/products/count', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  return {
    productTotalCount: (data as number | null) ?? null,
    error,
    isLoading,
  }
}

export const useProduct = (productId: string) => {
  const { data, error, isLoading } = useSWR(`/api/products/${productId}`, fetcher)

  return {
    product: (data as IProduct | null) ?? null,
    error,
    isLoading,
  }
}
