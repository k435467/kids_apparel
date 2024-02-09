'use client'
import ProductCard from '@/components/product/ProductCard'
import { useHomePageProducts } from '@/utils/network'

export default function Home() {
  const { products, isLoading } = useHomePageProducts()

  if (isLoading) {
    return <div>載入中...</div>
  }

  if (products.length === 0) {
    return <div>尚無商品</div>
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
