'use client'
import { blobImagePath } from '@/utils/image'
import { useProduct } from '@/utils/network'
import { Form, Select, Button, Input } from 'antd'

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params

  const [form] = Form.useForm()

  const { product, error, isLoading } = useProduct(productId)

  if (isLoading || !product) {
    return <div>載入中...</div>
  }

  const handleAddToCart = (values: { size: string; quantity: number }) => {
    // const cartItem: ICartItem = {
    //   addTime: new Date(),
    //   price: product.sizes.find((v) => v.size === values.size)?.price ?? 99999,
    // }
    // fetch('/api/cart', {
    //   method: 'POST',
    //   body: JSON.stringify(values),
    // })
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
          className="mt-4"
        >
          <Form.Item label="尺寸" name="size" rules={[{ required: true }]}>
            <Select
              options={product.sizes.map((size) => ({
                value: size.size,
                label: size.size,
              }))}
            />
          </Form.Item>
          <Form.Item label="數量" name="quantity" rules={[{ required: true, min: 1 }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              加入購物車
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
