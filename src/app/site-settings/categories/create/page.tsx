'use client'
import React, { useState } from 'react'
import { Button, Form, Input, List, Modal, Switch } from 'antd'
import { ProductSelectionModal } from '@/components/product/ProductSelectionModal'
import { IDocProduct } from '@/types/database'
import { blobImagePath } from '@/utils/image'
import { formatPriceRange } from '@/utils/format'

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
  const [selectedProducts, setSelectedProducts] = useState<IDocProduct[]>([])

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
          <ProductSelectionModal
            open={open}
            onCancel={() => setOpen(false)}
            onFinish={(v) => {
              setSelectedProducts((x) => [...x, ...v])
            }}
          />
        </div>

        <List
          itemLayout="horizontal"
          dataSource={selectedProducts}
          rowKey={(v) => v._id as string}
          renderItem={(item, index) => {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div className="relative h-8 w-8 rounded-full">
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={`${blobImagePath}${item.coverImageName}`}
                      />
                    </div>
                  }
                  title={item.name}
                  description={formatPriceRange(item.price)}
                />
              </List.Item>
            )
          }}
        />

        <Button className="mt-8" htmlType="submit" type="primary">
          新增
        </Button>
      </Form>
    </div>
  )
}
