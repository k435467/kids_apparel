'use client'
import React from 'react'
import { useCategories } from '@/networks/categories'
import { Button, Empty, Spin } from 'antd'
import Link from 'next/link'
import { CategoryDndList } from '@/components/category/CategoryDndList'

export default function SiteSettingCategories({}: {}) {
  const { data: categories, isLoading } = useCategories()

  return (
    <div className="m-4">
      <Link href="/site-settings/categories/create">
        <Button className="mb-4" type="primary">
          新增
        </Button>
      </Link>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      )}

      {!isLoading && (!categories || categories.length === 0) && (
        <div className="flex justify-center py-8">
          <Empty />
        </div>
      )}

      {categories && categories.length > 0 && <CategoryDndList categories={categories} />}

      {/*{categories && categories.length > 0 && (*/}
      {/*  <div className="mt-8 flex flex-col gap-8">*/}
      {/*    {categories.map((v) => (*/}
      {/*      <div*/}
      {/*        key={v._id as string}*/}
      {/*        onClick={() => {*/}
      {/*          router.push(`/site-settings/categories/${v._id}`)*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <div>{v.title}</div>*/}
      {/*        <div className="mt-2 text-xs font-light text-neutral-400">*/}
      {/*          {`${v.display ? '顯示' : '不顯示'}, ${v.productIds.length}個商品`}*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  )
}
