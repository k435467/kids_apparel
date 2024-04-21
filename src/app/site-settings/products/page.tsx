'use client'
import React from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import { useProducts } from '@/networks/products'
import { ProductFilterForm } from '@/components/product/ProductFilterForm'
import { ProductList } from '@/components/product/ProductList'
import { useRouter } from 'next/navigation'
import { usePagination } from '@/hooks/usePagination'
import { useProductFilter } from '@/hooks/useProductFilter'

export default function SiteSettingProductsPage({}: {}) {
  const router = useRouter()
  const { productFilter, setProductFilter } = useProductFilter()
  const { pagination, paginationProps } = usePagination()
  const { data, isLoading } = useProducts(pagination, productFilter)

  return (
    <div className="m-4">
      <Link href="/site-settings/products/create">
        <Button type="primary">新增商品</Button>
      </Link>

      <div className="mb-8 mt-4">
        <ProductFilterForm setProductFilter={setProductFilter} />
      </div>

      <ProductList
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          ...paginationProps,
          total: data?.total,
        }}
        onClickProduct={(v) => {
          router.push(`/site-settings/products/${v._id}`)
        }}
      />
    </div>
  )
}
