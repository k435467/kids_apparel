'use client'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Spin, Switch, Divider, Popconfirm } from 'antd'
import { ProductList, ProductSelectionModal } from '@/components/product/ProductSelectionModal'
import { IDocCategory, IDocProduct } from '@/types/database'
import { useRouter } from 'next/navigation'
import { MessageInstance } from 'antd/es/message/interface'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type FieldType = {
  title: string
  display: boolean
}

export interface ISiteSettingCateogriesEditService {
  save: (
    setActionLoading: React.Dispatch<React.SetStateAction<boolean>>,
    formValues: FieldType,
    messageApi: MessageInstance,
    router: AppRouterInstance,
  ) => void
  delete?: (
    setActionLoading: React.Dispatch<React.SetStateAction<boolean>>,
    messageApi: MessageInstance,
    router: AppRouterInstance,
  ) => void
  addProducts?: (messageApi: MessageInstance) => void
  removeProducts?: (messageApi: MessageInstance) => void
}

export const SiteSettingCategoriesEdit: React.FC<{
  category?: IDocCategory
  isLoading?: boolean
  service?: ISiteSettingCateogriesEditService
}> = ({ category, isLoading, service }) => {
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
          } as FieldType
        }
        onFinish={(v) => {
          service?.save(setActionLoading, v, messageApi, router)
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
                service?.delete?.(setActionLoading, messageApi, router)
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
