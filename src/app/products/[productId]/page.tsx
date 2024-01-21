'use client'
import { blobImagePath } from '@/utils/image'
import { useProduct } from '@/utils/network'
import { Select } from 'antd'
import { useState } from 'react'

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params

  const { product, error, isLoading } = useProduct(productId)

  // const [size, setSize] = useState<ISizePriceStock | null>(null)

  if (isLoading || !product) {
    return <div>載入中...</div>
  }

  return (
    <div className="mb-[50%]">
      <img
        className="aspect-[3/4] w-full object-cover"
        src={`${blobImagePath}${product.imgNames?.[0]}`}
        alt=""
      />
      <div className="mx-1">
        <div className="text-xl">{product.name}</div>
        <div className="mt-4">{product.description}</div>
        <ul className="ml-7 mt-4 list-disc">
          {product.descriptionList?.map((description, index) => <li key={index}>{description}</li>)}
        </ul>

        <Select
          className="mt-4 w-40"
          options={product.sizes.map((size) => ({
            value: size.size,
            label: size.size,
          }))}
        />
      </div>
    </div>
  )
}
