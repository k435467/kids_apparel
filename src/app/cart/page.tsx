'use client'
import React, { useRef, useState } from 'react'
import { useCart } from '@/utils/network'
import { Button, Empty, Modal, Select, Spin, message } from 'antd'
import { blobImagePath } from '@/utils/image'
import { currencyFormat } from '@/utils/format'
import { IPutCartReqBody } from '@/app/api/cart/route'
import { useSWRConfig } from 'swr'

interface IModalData {
  isOpen: boolean
  product: {
    id: string
    name: string
    size: string
    quantity: number
  } | null
}

const quantityOptions = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
]

export default function CartPage({}: {}) {
  const [messageApi, contextHolder] = message.useMessage()
  const { mutate } = useSWRConfig()

  const { data: cart, isLoading: isLoadingCart } = useCart()

  const [modalData, setModalData] = useState<IModalData>({
    isOpen: false,
    product: null,
  })
  const [quantitySelectValue, setQuantitySelectValue] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (isLoadingCart) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (!isLoadingCart && (!cart || !cart.items || cart.items.length === 0)) {
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
      {contextHolder}
      {cart?.items?.map((item, index) => {
        const product = cart.productData.find((v) => v._id === item.productId)
        if (!product) return null
        const price = product.sizes?.find((v) => v.size === item.size)?.price
        return (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex items-center gap-2"
            onClick={() => {
              setModalData({
                isOpen: true,
                product: {
                  id: item.productId,
                  name: product.name,
                  size: item.size,
                  quantity: item.quantity,
                },
              })
              setQuantitySelectValue(item.quantity)
            }}
          >
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
      <div className="mx-2 mt-6 flex justify-between">
        <div>總額:</div>
        <div>{currencyFormat(totalPrice)}</div>
      </div>
      {/*<div className="mt-6 text-center text-sm text-neutral-400">*/}
      {/*  <div>本網站只紀錄訂單，不包含金流服務</div>*/}
      {/*  <div>請下單後與賣家確認付款方式</div>*/}
      {/*</div>*/}
      <Button className="mt-6" block type="primary">
        下單
      </Button>

      <Modal
        closeIcon={false}
        open={modalData.isOpen}
        title={<div className="text-center">{modalData.product?.name}</div>}
        onCancel={() => setModalData({ isOpen: false, product: null })}
        footer={false}
      >
        <div className="mt-6 text-center text-neutral-500">{modalData.product?.size}</div>
        <div className="flex justify-center">
          <Select
            className="mt-4 min-w-[80px]"
            options={quantityOptions}
            value={quantitySelectValue}
            onChange={(v) => setQuantitySelectValue(v)}
          />
        </div>
        <Button
          block
          type="primary"
          className="mt-8"
          loading={isSubmitting}
          onClick={() => {
            // Close modal if not modified
            if (quantitySelectValue === modalData.product?.quantity) {
              setModalData({ isOpen: false, product: null })
              return
            }
            // --
            const reqBody: IPutCartReqBody = {
              action: quantitySelectValue === 0 ? 'remove' : 'update',
              data: {
                productId: modalData.product?.id ?? '',
                size: modalData.product?.size ?? '',
                quantity: quantitySelectValue,
              },
            }
            setIsSubmitting(true)
            fetch('/api/cart', { method: 'PUT', body: JSON.stringify(reqBody) })
              .then(async () => {
                messageApi.success('成功')
                await mutate('/api/cart')
              })
              .catch((err) => {
                messageApi.error('失敗')
              })
              .finally(() => {
                setIsSubmitting(false)
                setModalData({ isOpen: false, product: null })
              })
          }}
        >
          確認
        </Button>
      </Modal>
    </div>
  )
}
