'use client'
import { useCategoryProducts } from '@/utils/network'
import { useEffect, useState } from 'react'

export default function CategoryProducts({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params

  const { products, error, isLoading } = useCategoryProducts(categoryId)

  if (products.length > 0 && products[0].categoryId != categoryId) {
    return <div>載入中...</div>
  }

  return (
    <div>
      <div>CategoryProducts</div>
      <div>
        {products.map((product) => {
          return <div>{product.name}</div>
        })}
      </div>
    </div>
  )
}
