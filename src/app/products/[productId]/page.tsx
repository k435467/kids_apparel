'use client'
import { blobImagePath } from '@/utils/image'
import { useProduct } from '@/utils/network'
import { Select, Button, Spin, Carousel, message } from 'antd'
import { mutate } from 'swr'
import { formatCurrency } from '@/utils/format'
import { useEffect, useState } from 'react'
import { IPutCartReqBody } from '@/app/api/cart/route'
import { quantityOptions } from '@/utils/misc'

const useSelectedSizeAndQuantity = (product: IProduct | undefined) => {
  const [selectedSize, setSelectedSize] = useState<{
    size: string
    price: number
  } | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  // Init selectedSize
  useEffect(() => {
    setSelectedSize(product?.sizes ? product.sizes[0] : null)
  }, [product])

  return {
    selectedSize,
    setSelectedSize,
    selectedQuantity,
    setSelectedQuantity,
  }
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params

  const [messageApi, contextHolder] = message.useMessage()

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { data: product, isLoading } = useProduct(productId)

  let { selectedQuantity, selectedSize, setSelectedQuantity, setSelectedSize } =
    useSelectedSizeAndQuantity(product)

  if (isLoading || !product) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    const reqBody: IPutCartReqBody = {
      action: 'add',
      data: {
        productId,
        size: selectedSize.size,
        quantity: selectedQuantity,
      },
    }
    setIsSubmitting(true)
    fetch('/api/cart', {
      method: 'PUT',
      body: JSON.stringify(reqBody),
    })
      .then(() => {
        messageApi.success('成功')
        setTimeout(() => {
          mutate('/api/cart', undefined, {
            revalidate: true,
          })
        }, 1000)
      })
      .catch(() => {
        messageApi.error('失敗')
      })
      .finally(() => {
        setTimeout(() => {
          setIsSubmitting(false)
        }, 1000)
      })
  }

  return (
    <div className="mb-[50%]">
      {contextHolder}

      {/* 圖片 */}
      <Carousel autoplay autoplaySpeed={3000}>
        {product.imgNames?.map((v) => (
          <img
            key={v}
            className="aspect-[3/4] w-full object-cover"
            src={`${blobImagePath}${v}`}
            alt=""
          />
        ))}
      </Carousel>

      <div className="mx-4">
        {/* 名稱, 描述 */}
        <div className="text-xl">{product.name}</div>

        {/* 售價 */}
        <div className="mt-4 text-right text-xl text-rose-600 first-letter:text-sm">
          {selectedSize ? formatCurrency(selectedSize.price) : '--'}
        </div>

        {/* 規格 */}

        <div className="mt-8 flex items-baseline gap-2">
          <div className="break-keep">規格：</div>
          <div className="flex flex-wrap gap-4">
            {product.sizes.map((size) => (
              <Button
                key={size.size}
                onClick={() => setSelectedSize(size)}
                type={selectedSize === size ? 'primary' : undefined}
              >
                {size.size}
              </Button>
            ))}
          </div>
        </div>

        {/* 數量 */}

        <div className="mt-8 flex items-center gap-2">
          <div>數量：</div>
          <Select
            className="min-w-[80px]"
            options={quantityOptions}
            value={selectedQuantity}
            onChange={(v) => setSelectedQuantity(v)}
          />
        </div>

        {/* 加入購物車 */}
        <Button
          block
          className="mt-8"
          type="primary"
          size="large"
          loading={isSubmitting}
          onClick={handleAddToCart}
        >
          加入購物車
        </Button>

        <div className="mt-8">{product.description}</div>
        <ul className="ml-7 mt-4 list-disc">
          {product.descriptionList?.map((description, index) => <li key={index}>{description}</li>)}
        </ul>
      </div>
    </div>
  )
}
