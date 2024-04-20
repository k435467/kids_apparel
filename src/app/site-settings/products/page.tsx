'use client'
import React, { useState } from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import { useProducts } from '@/networks/products'
import { SearchForm } from '@/components/product/ProductSearchForm'
import { IGetProductsCondition } from '@/app/api/products/route'
import { ProductList } from '@/components/product/ProductList'
import { useRouter } from 'next/navigation'

export default function SiteSettingProductsPage({}: {}) {
  const router = useRouter()
  const [condition, setCondition] = useState<IGetProductsCondition>({
    page: 1,
    size: 10,
  })
  const { data, isLoading } = useProducts(condition)

  return (
    <div className="m-4">
      <Link href="/site-settings/products/create">
        <Button type="primary">新增商品</Button>
      </Link>

      <div className="mb-8 mt-4">
        <SearchForm setCondition={setCondition} />
      </div>

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
        onClickProduct={(v) => {
          router.push(`/site-settings/products/${v._id}`)
        }}
      />
    </div>
  )
}
