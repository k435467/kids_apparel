import { useState } from 'react'

export interface IProductFilter {
  name?: string
  startTime?: string
  endTime?: string
  sort: string
  asc: 1 | -1
}

export const defaultProductFilter: IProductFilter = {
  sort: '_id',
  asc: -1,
}

export const useProductFilter = () => {
  const [productFilter, setProductFilter] = useState<IProductFilter>(defaultProductFilter)

  return {
    productFilter,
    setProductFilter,
  }
}
