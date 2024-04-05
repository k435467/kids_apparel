'use client'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Spin, Switch, Divider, Popconfirm } from 'antd'
import { ProductList, ProductSelectionModal } from '@/components/product/ProductSelectionModal'
import { IDocCategory, IDocProduct } from '@/types/database'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'

type FieldType = {
  title: string
  display: boolean
  products: {
    productId: string
    productName: string
  }[]
}

export const SiteSettingCategoriesEdit: React.FC<{
  category?: IDocCategory
  isLoading?: boolean
}> = ({ category, isLoading }) => {
  const [form] = Form.useForm<FieldType>()
  const [open, setOpen] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<IDocProduct[]>([])
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  // Init form
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        title: category.title,
        display: category.display,
        products: [],
      })
    }
  }, [category, form])

  if (isLoading) {
    return (
      <div className="m-4 flex justify-center py-8">
        <Spin />
      </div>
    )
  }

  return (
    <div className="m-4">
      {contextHolder}
      <Form
        form={form}
        initialValues={
          {
            title: '',
            display: true,
            products: [],
          } as FieldType
        }
        onFinish={(v) => {
          setActionLoading(true)
          fetch('/api/categories', {
            method: 'POST',
            body: JSON.stringify({
              title: v.title,
              display: v.display,
              sort: 0,
              createTime: new Date(),
              updateTime: new Date(),
              productIds: [],
            } as IDocCategory),
          })
            .then(async () => {
              await mutate('/api/categories')
              messageApi.success('成功, 返回列表...')
              setTimeout(() => {
                router.push('/site-settings/categories')
              }, 1000)
            })
            .catch(() => {
              setActionLoading(false)
              messageApi.error('失敗')
            })
        }}
      >
        <Form.Item<FieldType> label="名稱" name="title">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="顯示" name="display">
          <Switch />
        </Form.Item>

        <div className="mt-4 flex justify-between">
          <Button htmlType="submit" type="primary" loading={actionLoading}>
            確認
          </Button>
          {category && (
            <Popconfirm
              title="確認刪除"
              showCancel={false}
              placement="left"
              onConfirm={() => {
                setActionLoading(true)
                fetch(`/api/categories/${category._id}`, {
                  method: 'DELETE',
                })
                  .then(async () => {
                    await mutate('/api/categories')
                    messageApi.success('成功, 返回列表...')
                    setTimeout(() => {
                      router.push('/site-settings/categories')
                    }, 1000)
                  })
                  .catch(() => {
                    setActionLoading(false)
                  })
              }}
            >
              <Button danger loading={actionLoading}>
                刪除
              </Button>
            </Popconfirm>
          )}
        </div>
      </Form>

      <Divider />

      {category && (
        <div className="mt-8">
          <Button onClick={() => setOpen(true)}>選擇商品</Button>
          <ProductSelectionModal
            open={open}
            onCancel={() => setOpen(false)}
            onFinish={(v) => {
              setDataSource((x) => [...v, ...x])
            }}
          />
          <ProductList
            dataSource={dataSource}
            pagination={{
              total: dataSource.length,
              current: 1,
              pageSize: 10,
              onChange: (p, s) => {},
            }}
            selectedProducts={[]}
            onClickProduct={(v) => {}}
          />
        </div>
      )}
    </div>
  )
}
