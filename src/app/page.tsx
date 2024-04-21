'use client'
import { useProducts } from '@/networks/products'
import React from 'react'
import { ProductCardList } from '@/components/product/ProductCardList'
import { usePagination } from '@/hooks/usePagination'

export default function Home() {
  const { pagination, paginationProps } = usePagination()
  const { data, isLoading } = useProducts(pagination)

  return (
    <div className="m-4">
      <ProductCardList
        products={data?.data}
        loading={isLoading}
        pagination={{
          ...paginationProps,
          total: data?.total,
        }}
      />
    </div>
  )
}
