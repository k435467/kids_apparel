import React from 'react'
import { IDocProduct } from '@/types/database'
import { ProductCard } from '@/components/product/ProductCard'
import { Empty, Pagination, Spin } from 'antd'

export const ProductCardList: React.FC<{
  products?: IDocProduct[]
  pagination: {
    page: number
    pageSize: number
  }
  loading: boolean
}> = ({ products, pagination, loading }) => {
  if (loading) {
    return (
      <div className="my-8 flex justify-center">
        <Spin />
      </div>
    )
  }
  if (!products || products.length === 0) {
    return (
      <div className="my-8 flex justify-center">
        <Empty />
      </div>
    )
  }
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard product={product} key={product._id as string} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination current={pagination.page} pageSize={pagination.pageSize} />
      </div>
    </div>
  )
}
