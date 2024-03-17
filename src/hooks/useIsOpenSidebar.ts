import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createUrl } from '@/utils/navigation'

export const useIsOpenSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isOpenSidebar = searchParams.get('sidebar') === '1'

  const setIsOpenSidebar = (value: boolean) => {
    const url = createUrl(
      pathname,
      searchParams,
      value
        ? {
            set: {
              sidebar: '1',
            },
          }
        : {
            delete: ['sidebar'],
          },
    )
    router.replace(url, { scroll: false })
  }

  return {
    isOpenSidebar,
    setIsOpenSidebar,
  }
}
