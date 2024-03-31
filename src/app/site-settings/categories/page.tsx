'use client'
import React from 'react'
import { useCategories } from '@/networks/categories'
import { Button } from 'antd'
import Link from 'next/link'

export default function SiteSettingCategories({}: {}) {
  const { data: categories, isLoading } = useCategories()

  return (
    <div className="m-4">
      <Link href="/site-settings/categories/create">
        <Button type="primary">新增</Button>
      </Link>

      {/* List of categories */}
      {/* A category includes drag handle, title, and edit button  */}
    </div>
  )
}
