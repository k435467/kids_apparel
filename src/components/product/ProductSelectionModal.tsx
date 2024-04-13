'use client'
import React, { useState } from 'react'
import { Modal } from 'antd'
import { useProducts } from '@/networks/products'
import { IGetProductsCondition } from '@/app/api/products/route'
import { formatDayjsToUTCDayEnd, formatDayjsToUTCDayStart } from '@/utils/format'
import { IDocProduct } from '@/types/database'
import { SearchForm } from '@/components/product/ProductSearchForm'
import { ProductList } from '@/components/product/ProductList'

export const ProductSelectionModal: React.FC<{
  open: boolean
  onCancel: () => void
  onFinish: (v: IDocProduct[]) => Promise<any>
}> = ({ open, onCancel, onFinish }) => {
  const [condition, setCondition] = useState<IGetProductsCondition>({
    page: 1,
    size: 10,
  })
  const { data, isLoading } = useProducts(condition)
  const [selectedProducts, setSelectedProducts] = useState<IDocProduct[]>([])
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  return (
    <Modal
      title="選擇商品"
      open={open}
      confirmLoading={actionLoading}
      onCancel={() => {
        onCancel()
        setSelectedProducts([])
      }}
      onOk={async () => {
        setActionLoading(true)
        await onFinish(selectedProducts)
        setActionLoading(false)
        onCancel()
        setSelectedProducts([])
      }}
    >
      <SearchForm
        onFinish={(v) => {
          setCondition({
            ...condition,
            ...v,
            name: v.title && v.title.length > 0 ? v.title : undefined,
            startTime: formatDayjsToUTCDayStart(v.startTime),
            endTime: formatDayjsToUTCDayEnd(v.endTime),
          })
        }}
      />
      <ProductList
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          total: data?.total,
          current: condition.page,
          pageSize: condition.size,
          onChange: (page, pageSize) => {
            setCondition((v) => ({
              ...v,
              page: pageSize == v.size ? page : 1,
              size: pageSize,
            }))
          },
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
    </Modal>
  )
}
