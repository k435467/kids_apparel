'use client'
import React, { useState } from 'react'
import { Button, Form, Input, Modal, Switch } from 'antd'
import { ProductSelectionModal } from '@/components/product/ProductSelectionModal'

type FieldType = {
  title: string
  display: boolean
  products: {
    productId: string
    productName: string
  }[]
}

export default function SiteSettingCategoriesCreate({}: {}) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="m-4">
      <Form
        initialValues={
          {
            title: '',
            display: true,
            products: [],
          } as FieldType
        }
      >
        <Form.Item<FieldType> label="名稱" name="title">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="顯示" name="display">
          <Switch />
        </Form.Item>

        <div className="mt-8">
          <Button onClick={() => setOpen(true)}>選擇商品</Button>
          <ProductSelectionModal open={open} onCancel={() => setOpen(false)} />
        </div>

        <Button className="mt-8" htmlType="submit" type="primary">
          新增
        </Button>
      </Form>
    </div>
  )
}
