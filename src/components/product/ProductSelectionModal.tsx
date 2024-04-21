'use client'
import React, { useState } from 'react'
import { Modal } from 'antd'
import { useProducts } from '@/networks/products'
import { IDocProduct } from '@/types/database'
import { ProductFilterForm } from '@/components/product/ProductFilterForm'
import { ProductList } from '@/components/product/ProductList'
import { usePagination } from '@/hooks/usePagination'
import { useProductFilter } from '@/hooks/useProductFilter'

export const ProductSelectionModal: React.FC<{
  open: boolean
  onCancel: () => void
  onFinish: (v: IDocProduct[]) => Promise<any>
}> = ({ open, onCancel, onFinish }) => {
  const { pagination, paginationProps } = usePagination()
  const { productFilter, setProductFilter } = useProductFilter()
  const { data, isLoading } = useProducts(pagination, productFilter)

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
      <ProductFilterForm setProductFilter={setProductFilter} />
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
    </Modal>
  )
}
