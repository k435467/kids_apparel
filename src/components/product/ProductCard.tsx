import { currencyFormat } from '@/utils/format'
import { blobImagePath } from '@/utils/image'
import Link from 'next/link'
import React from 'react'

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const sellPrice = Math.min(...product.sizes.map((v) => (v.price ? v.price : 100000)))

  return (
    <Link className="w-full" href={`/products/${product._id}`}>
      <img
        className="aspect-[3/4] w-full object-cover"
        src={`${blobImagePath}${product.imgNames?.[0]}`}
        alt=""
      />
      <div>{product.name}</div>
      <div className="text-neutral-500">{currencyFormat(sellPrice)}</div>
    </Link>
  )
}

export default ProductCard
