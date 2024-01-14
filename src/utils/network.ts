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
