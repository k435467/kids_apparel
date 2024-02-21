'use client'
import React from 'react'
import { useCart } from '@/utils/network'
import { Empty, Spin } from 'antd'
import { blobImagePath } from '@/utils/image'

export default function CartPage({}: {}) {
  const { data: cart, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (!isLoading && !cart) {
    return (
      <div className="mt-8">
        <Empty />
      </div>
    )
  }

  return (
    <div>
      {cart?.items.map((item) => {
        const product = cart.productData.find((v) => v._id === item.productId)
        if (!product) return null
        return (
          <div key={`${item.productId}-${item.size}`}>
            <img
              className="h-16 w-16 rounded-lg object-cover"
              src={blobImagePath + product.imgName}
              alt=""
            />
            <div>{product?.name}</div>
          </div>
        )
      })}
    </div>
  )
}
