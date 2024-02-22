'use client'
import { blobImagePath } from '@/utils/image'
import { useProduct } from '@/utils/network'
import { Form, Select, Button, Spin, Carousel, InputNumber, message } from 'antd'
import { useSWRConfig } from 'swr'
import { currencyFormat } from '@/utils/format'
import { useState } from 'react'
import { IPutCartReqBody } from '@/app/api/cart/route'

type FieldType = {
  size: string
  quantity: number
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params

  const [messageApi, contextHolder] = message.useMessage()

  const [form] = Form.useForm<FieldType>()
  const selectedSize = Form.useWatch('size', form)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { mutate } = useSWRConfig()

  const { data: product, isLoading } = useProduct(productId)
  const selectedSizePrice =
    product?.sizes.find((v) => v.size === selectedSize)?.price ?? product?.sizes[0].price

  if (isLoading || !product) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  const handleAddToCart = (values: { size: string; quantity: number }) => {
    setIsSubmitting(true)
    const reqBody: IPutCartReqBody = {
      action: 'add',
      data: {
        productId,
        size: values.size,
        quantity: values.quantity,
      },
    }
    fetch('/api/cart', {
      method: 'PUT',
      body: JSON.stringify(reqBody),
    })
      .then(() => {
        messageApi.success('成功')
        form.resetFields()
        setTimeout(() => {
          mutate('/api/cart')
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
      <div className="mx-1">
        <div className="text-xl">{product.name}</div>
        <div className="mt-4">{product.description}</div>
        <ul className="ml-7 mt-4 list-disc">
          {product.descriptionList?.map((description, index) => <li key={index}>{description}</li>)}
        </ul>

        <Form
          name="add-to-cart-form"
          layout="inline"
          onFinish={(values) => handleAddToCart(values)}
          onFinishFailed={() => {}}
          autoComplete="off"
          form={form}
          initialValues={{
            size: product.sizes[0].size,
            quantity: 1,
          }}
          className="mx-2 mt-4"
        >
          <Form.Item<FieldType> label="尺寸" name="size" rules={[{ required: true }]}>
            <Select
              options={product.sizes.map((size) => ({
                value: size.size,
                label: size.size,
              }))}
              size="large"
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="數量"
            name="quantity"
            validateTrigger="onBlur"
            rules={[{ required: true }]}
          >
            <InputNumber size="large" />
          </Form.Item>
          <div className="m-2 w-full text-right text-lg">
            <div>{selectedSizePrice ? currencyFormat(selectedSizePrice) : '--'}</div>
          </div>
          <Button
            block
            className="mt-4"
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
          >
            加入購物車
          </Button>
        </Form>
      </div>
    </div>
  )
}
