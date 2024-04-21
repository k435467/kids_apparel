'use client'
import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, Input, message, Modal, Popconfirm, Spin, Switch } from 'antd'
import { ProductSelectionModal } from '@/components/product/ProductSelectionModal'
import { IDocCategory, IDocProduct } from '@/types/database'
import { useRouter } from 'next/navigation'
import { MessageInstance } from 'antd/es/message/interface'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useCategoryProducts } from '@/networks/categories'
import { ProductFilterForm } from '@/components/product/ProductFilterForm'
import { ProductList } from '@/components/product/ProductList'
import { useProductFilter } from '@/hooks/useProductFilter'
import { usePagination } from '@/hooks/usePagination'

const ProductSection: React.FC<{
  addProducts: (v: IDocProduct[]) => Promise<any>
  removeProducts: (v: IDocProduct[]) => Promise<any>
  categoryId: string
}> = ({ addProducts, removeProducts, categoryId }) => {
  // Modal opens
  const [openProductSelection, setOpenProductSelection] = useState<boolean>(false)
  const [openFilter, setOpenFilter] = useState<boolean>(false)

  // Data
  const { pagination, paginationProps, resetPagination } = usePagination()
  const { productFilter, setProductFilter } = useProductFilter()
  const { data, isLoading } = useCategoryProducts(categoryId, pagination, productFilter)

  // Others
  const [selectedProducts, setSelectedProducts] = useState<IDocProduct[]>([])
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-between">
        <Button type="primary" onClick={() => setOpenProductSelection(true)}>
          選擇商品
        </Button>
        <div className="flex gap-4">
          <Button onClick={() => setOpenFilter(true)}>篩選</Button>
          <Button
            danger
            loading={actionLoading}
            onClick={async () => {
              setActionLoading(true)
              await removeProducts(selectedProducts)
              setSelectedProducts([])
              resetPagination()
              setActionLoading(false)
            }}
          >
            移除{selectedProducts.length > 0 ? `(${selectedProducts.length})` : ''}
          </Button>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        open={openFilter}
        footer={null}
        onCancel={() => {
          setOpenFilter(false)
        }}
      >
        <ProductFilterForm
          setProductFilter={setProductFilter}
          onFinish={(v) => {
            setOpenFilter(false)
          }}
        />
      </Modal>

      <ProductSelectionModal
        open={openProductSelection}
        onCancel={() => setOpenProductSelection(false)}
        onFinish={(v) => {
          resetPagination()
          return addProducts(v)
        }}
      />

      <ProductList
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          ...paginationProps,
          total: data?.total,
        }}
        selectedProducts={selectedProducts}
        onClickProduct={(v) => {
          if (selectedProducts.find((x) => x._id === v._id)) {
            setSelectedProducts((x) => x.filter((y) => y._id !== v._id))
          } else {
            setSelectedProducts((x) => [...x, v])
          }
        }}
      />
    </div>
  )
}

// -----

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
  addProducts?: (messageApi: MessageInstance, products: IDocProduct[]) => Promise<any>
  removeProducts?: (messageApi: MessageInstance, products: IDocProduct[]) => Promise<any>
}

export const CategoryEditor: React.FC<{
  category?: IDocCategory
  isLoading?: boolean
  service?: ISiteSettingCateogriesEditService
}> = ({ category, isLoading, service }) => {
  const [form] = Form.useForm<FieldType>()
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
        <ProductSection
          addProducts={(v) => service!.addProducts!(messageApi, v)}
          removeProducts={(v) => service!.removeProducts!(messageApi, v)}
          categoryId={category._id as string}
        />
      )}
    </div>
  )
}
