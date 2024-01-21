'use client'
import ProductCard from '@/components/product/ProductCard'
import { useCategoryProducts } from '@/utils/network'

export default function CategoryProducts({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params

  const { products, error, isLoading } = useCategoryProducts(categoryId)

  if (products.length > 0 && products[0].categoryId != categoryId) {
    return <div>載入中...</div>
  }

  if (products.length === 0) {
    return <div>該分類尚無商品</div>
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
