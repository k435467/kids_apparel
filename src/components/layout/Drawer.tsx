'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CloseOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import AntdThemeProvider from '@/components/AntdThemeProvider'

const variants: Variants = {
  open: { opacity: 1, x: '-24px' },
  closed: { opacity: 0, x: '-100%' },
}

const Drawer: React.FC<{}> = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isOpen = searchParams.get('sideBar') === '1'

  const queryStringWithoutSideBar = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('sideBar')
    return params.toString()
  }, [searchParams])

  const menuItems: MenuProps['items'] = [
    {
      key: 'item1',
      label: 'item1',
    },
    {
      key: 'item2',
      label: 'item2',
    },
  ]

  return (
    <AntdThemeProvider>
      <div
        onClick={() => {
          router.replace(pathname + '?' + queryStringWithoutSideBar)
        }}
        className={`${
          isOpen ? 'bg-white/80' : 'pointer-events-none bg-white/0'
        } absolute inset-0 z-[999] transition-all duration-300`}
      />

      <motion.div
        variants={variants}
        className="absolute bottom-0 top-0 z-[1000] w-60 border-r border-solid border-black bg-white pl-6"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="m-4">
          <Link href={{ pathname, query: queryStringWithoutSideBar }}>
            <CloseOutlined />
          </Link>
        </div>

        <Menu mode="inline" items={menuItems} />
      </motion.div>
    </AntdThemeProvider>
  )
}

export default Drawer
