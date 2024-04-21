import { useState } from 'react'
import type { PaginationProps } from 'antd'

export interface IPagination {
  current: number
  pageSize: number
}

const defaultPagination: IPagination = {
  current: 1,
  pageSize: 10,
}

export const usePagination = () => {
  const [pagination, setPagination] = useState<IPagination>(defaultPagination)

  const paginationProps: PaginationProps = {
    ...pagination,
    pageSizeOptions: [10, 20, 30],
    onChange: (current, pageSize) =>
      setPagination({
        current,
        pageSize,
      }),
  }

  const resetPagination = () => {
    setPagination(defaultPagination)
  }

  return {
    pagination,
    paginationProps,
    resetPagination,
  }
}
