'use client'
import React from 'react'
import { useCategories } from '@/networks/categories'
import { Button, Empty, Spin } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SiteSettingCategories({}: {}) {
  const { data: categories, isLoading } = useCategories()
  const router = useRouter()

  return (
    <div className="m-4">
      <Link href="/site-settings/categories/create">
        <Button type="primary">新增</Button>
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

      {categories && categories.length > 0 && (
        <div className="mt-8 flex flex-col gap-8">
          {categories.map((v) => (
            <div
              key={v._id as string}
              onClick={() => {
                router.push(`/site-settings/categories/${v._id}`)
              }}
            >
              <div>{v.title}</div>
              <div className="text-xs font-light text-neutral-400">
                {v.display ? '顯示' : '不顯示'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
