'use client'
import React from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { useIsOpenSidebar } from '@/hooks/useIsOpenSidebar'

export const SidebarButton: React.FC<{}> = () => {
  const { setIsOpenSidebar } = useIsOpenSidebar()

  return (
    <div className="cursor-pointer" onClick={() => setIsOpenSidebar(true)}>
      <MenuOutlined />
    </div>
  )
}
