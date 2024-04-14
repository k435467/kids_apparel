'use client'
import React from 'react'
import { Button, Form, Input, Switch, Typography, InputNumber, FormInstance, message } from 'antd'
import { ProductImageUploader } from '@/components/product/ProductImageUploader'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import { accessChecker } from '@/utils/access'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export type FieldType = {
  coverImageName: string
  imageNames: string[]
  name: string
  description: string
  descriptionList: string[]
  basePrice: number
  colors: {
    id: string
    name: string
    priceAdjust?: number
  }[]
  sizes: {
    id: string
    name: string
    priceAdjust?: number
  }[]
  display: boolean
}

const FormListForDescriptionList: React.FC<{ name: string; label: string }> = ({ name, label }) => {
  return (
    <Form.List name={name}>
      {(fields, operation) => (
        <>
          {fields.map((field, index) => (
            <div key={field.key} className="flex items-end gap-4">
              <Form.Item className="grow" label={index === 0 ? label : ''} name={field.name}>
                <Input />
              </Form.Item>
              <MinusCircleOutlined
                className="mb-8 !text-neutral-400"
                onClick={() => operation.remove(index)}
              />
            </div>
          ))}
          <Button
            type="dashed"
            onClick={() => operation.add()}
            icon={<PlusOutlined />}
            className="mb-6"
          >
            新增
          </Button>
        </>
      )}
    </Form.List>
  )
}

// -----

const FormListForColorsAndSizes: React.FC<{ name: string; label: string }> = ({ name, label }) => {
  return (
    <Form.List name={name}>
      {(fields, operation) => (
        <>
          {fields.map((field, index) => (
            <div className="flex items-end gap-2" key={field.key}>
              <Form.Item
                name={[field.name, 'name']}
                label={index === 0 ? label : ''}
                className="grow"
              >
                <Input />
              </Form.Item>
              <Form.Item name={[field.name, 'priceAdjust']} label={index === 0 ? '價格調整' : ''}>
                <InputNumber />
              </Form.Item>
              <MinusCircleOutlined
                className="mb-8 !text-neutral-400"
                onClick={() => operation.remove(index)}
              />
            </div>
          ))}
          <Button
            type="dashed"
            onClick={() =>
              operation.add({
                id: uuidv4(),
                name: '',
              })
            }
            icon={<PlusOutlined />}
            className="mb-6"
          >
            新增
          </Button>
        </>
      )}
    </Form.List>
  )
}

// -----

const formInitValues: Partial<FieldType> = {
  descriptionList: [''],
  colors: [
    {
      id: uuidv4(),
      name: '',
    },
  ],
  sizes: [
    {
      id: uuidv4(),
      name: '',
    },
  ],
}

export interface IProductEditorProps {
  form: FormInstance<FieldType>
  formSubmitRequest: (values: FieldType) => Promise<any>
}

export const ProductEditor: React.FC<IProductEditorProps> = ({ form, formSubmitRequest }) => {
  const session = useSession()
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const handleSubmit = (values: FieldType) => {
    formSubmitRequest(values)
      .then((res) => {
        messageApi.success('成功')
        setTimeout(() => {
          router.push('/site-settings/products')
        }, 1000)
      })
      .catch((err) => {
        messageApi.error('失敗')
        if (err instanceof Error) {
          messageApi.error(err.message)
        }
      })
  }

  return (
    <div className="m-4">
      {contextHolder}
      <Form form={form} initialValues={formInitValues} layout="vertical" onFinish={handleSubmit}>
        <Form.Item<FieldType> name="coverImageName" label="封面圖">
          <ProductImageUploader mode="single" />
        </Form.Item>
        <Form.Item<FieldType> name="imageNames" label="圖片">
          <ProductImageUploader mode="multiple" />
        </Form.Item>
        <Form.Item<FieldType> name="name" label="名稱">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> name="description" label="描述">
          <Input.TextArea />
        </Form.Item>
        <FormListForDescriptionList name="descriptionList" label="條列式描述" />
        <Form.Item<FieldType> name="basePrice" label="基本價格">
          <InputNumber />
        </Form.Item>
        <FormListForColorsAndSizes name="colors" label="顏色" />
        <FormListForColorsAndSizes name="sizes" label="尺寸" />
        <Form.Item<FieldType> name="display" label="上架">
          <Switch />
        </Form.Item>
        <Button type="primary" className="mb-6 mt-4" htmlType="submit">
          儲存
        </Button>

        {accessChecker.hasAdminAccess(session.data?.user?.role) && (
          <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item>
        )}
      </Form>
    </div>
  )
}
