'use client'
import React from 'react'
import { useCart } from '@/utils/network'
import { Button, Empty, Spin } from 'antd'
import { blobImagePath } from '@/utils/image'
import { currencyFormat } from '@/utils/format'

export default function CartPage({}: {}) {
  const { data: cart, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (!isLoading && (!cart || !cart.items)) {
    return (
      <div className="mt-8">
        <Empty />
      </div>
    )
  }

  const totalPrice =
    cart?.items?.reduce((t, item) => {
      const product = cart.productData.find((v) => v._id === item.productId)
      const price = product?.sizes?.find((v) => v.size === item.size)?.price
      return price ? t + price : t
    }, 0) ?? 0

  return (
    <div className="m-4 mb-20">
      {cart?.items?.map((item, index) => {
        const product = cart.productData.find((v) => v._id === item.productId)
        if (!product) return null
        const price = product.sizes?.find((v) => v.size === item.size)?.price
        return (
          <div key={`${item.productId}-${item.size}`} className="flex items-center gap-2">
            <img
              className="h-16 w-16 rounded-lg object-cover"
              src={blobImagePath + product.imgName}
              alt=""
            />
            <div
              className="flex-grow py-6"
              style={{
                borderBottom: index !== cart.items.length - 1 ? '1px solid rgba(0,0,0,.1)' : '',
              }}
            >
              <div>{product?.name}</div>
              <div className="mt-1 flex justify-between">
                <div className="text-sm text-neutral-500">規格: {item.size}</div>
                <div className="text-sm text-neutral-500">x{item.quantity}</div>
              </div>
              <div className="text-right text-sm text-neutral-500">
                {typeof price === 'number' ? currencyFormat(price) : 'N/A'}
              </div>
            </div>
          </div>
        )
      })}
      <div className="flex justify-between">
        <div>總額: </div>
        <div>{currencyFormat(totalPrice)}</div>
      </div>
      <div className="mt-6 text-center text-sm text-neutral-400">
        <div>本網站只紀錄訂單，不包含金流服務</div>
        <div>請下單後與賣家確認付款方式</div>
      </div>
      <Button className="mt-6" block type="primary">
        下單
      </Button>
    </div>
  )
}
