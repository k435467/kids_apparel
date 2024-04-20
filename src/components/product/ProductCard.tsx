import { formatPriceRange } from '@/utils/format'
import { blobImagePath } from '@/utils/image'
import Link from 'next/link'
import React from 'react'
import { IDocProduct } from '@/types/database'
import { Card } from 'antd'

export const ProductCard: React.FC<{ product: IDocProduct }> = ({ product }) => {
  return (
    <Link className="w-full" href={`/products/${product._id}`}>
      <Card
        cover={
          <img
            className="aspect-[3/4] w-full object-cover"
            src={`${blobImagePath}${product.coverImageName}`}
            alt=""
          />
        }
      >
        <Card.Meta
          title={<div className="line-clamp-2 w-full text-wrap">{product.name}</div>}
          description={formatPriceRange(product.price)}
        />
      </Card>
    </Link>
  )
}
