'use client'
import ProductCard from '@/components/product/ProductCard'
import { useHomePageProducts } from '@/utils/network'
import { Empty, Spin } from 'antd'

export default function Home() {
  const { products, isLoading } = useHomePageProducts()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="mt-8">
        <Empty />
      </div>
    )
  }

  return (
    <div>
      <div className="mx-1 grid grid-cols-2 gap-2">
        {products.map((product) => {
          return <ProductCard key={product._id} product={product} />
        })}
      </div>
    </div>
  )
}
