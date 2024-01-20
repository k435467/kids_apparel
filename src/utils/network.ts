import useSWR from 'swr'

export const fetcher = (input: string | URL | globalThis.Request, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json())

export const useCategories = () => {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher)

  return {
    categories: (data as ICategory[]) ?? [],
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
