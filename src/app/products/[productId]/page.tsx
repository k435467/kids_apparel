'use client'
import { blobImagePath } from '@/utils/image'
import { useProduct } from '@/utils/network'
import { Form, Select, Button, Spin, Carousel, InputNumber } from 'antd'

type FieldType = {
  size: string
  quantity: number
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params

  const [form] = Form.useForm<FieldType>()

  const { product, isLoading } = useProduct(productId)

  if (isLoading || !product) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  const handleAddToCart = (values: { size: string; quantity: number }) => {
    const reqBody = {
      productId,
      size: values.size,
      quantity: values.quantity,
      snapshot: product,
    }
    fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({}),
    })
  }

  return (
    <div className="mb-[50%]">
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
          <Button block className="mt-4" type="primary" htmlType="submit" size="large">
            加入購物車
          </Button>
        </Form>
      </div>
    </div>
  )
}
