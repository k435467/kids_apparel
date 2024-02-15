'use client'
import React from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createUrl } from '@/utils/navigation'

export const DrawerLink: React.FC<{}> = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        router.replace(createUrl(pathname, searchParams, { set: { sideBar: '1' } }), {
          scroll: false,
        })
      }}
    >
      <MenuOutlined />
    </div>
  )
}
