'use client'
import React, { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CloseOutlined, ControlOutlined, LogoutOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import AntdThemeProvider from '@/components/AntdThemeProvider'
import { signOut, useSession } from 'next-auth/react'
import { useCategories } from '@/utils/network'

const BottomSection: React.FC<{ closeDrawer: () => void }> = ({ closeDrawer }) => {
  const { data: session } = useSession()

  return (
    <div className="ml-2">
      {session?.user?.role === 'admin' && (
        <>
          <Link href="/site-settings" className="flex items-center bg-transparent p-2">
            <ControlOutlined />
            <div className="ml-2">管理者介面</div>
          </Link>
          <Link href="/site-settings/categories" className="flex items-center bg-transparent p-2">
            <ControlOutlined />
            <div className="ml-2">分類管理</div>
          </Link>
          <Link href="/site-settings/products" className="flex items-center bg-transparent p-2">
            <ControlOutlined />
            <div className="ml-2">商品管理</div>
          </Link>
        </>
      )}

      {session?.user && (
        <button
          className="flex items-center bg-transparent p-2"
          onClick={() => {
            // delay signOut to prevent drawer open
            closeDrawer()
            setTimeout(() => {
              signOut()
            }, 300)
          }}
        >
          <LogoutOutlined />
          <div className="ml-2">登出</div>
        </button>
      )}
    </div>
  )
}

// ---

const variants: Variants = {
  open: { opacity: 1, x: '-32px' },
  closed: { opacity: 0, x: '-100%' },
}

export default function () {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { categories, error, isLoading } = useCategories()

  const isOpen = searchParams.get('sideBar') === '1'

  const queryStringWithoutSideBar = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('sideBar')
    return params.toString()
  }, [searchParams])

  return (
    <AntdThemeProvider>
      {/* Backdrop */}
      <div
        onClick={() => {
          router.replace(pathname + '?' + queryStringWithoutSideBar)
        }}
        className={`${
          isOpen ? 'bg-black/10' : 'pointer-events-none bg-black/0'
        } absolute inset-0 z-[999] transition-all duration-300`}
      />

      {/* Drawer */}
      <motion.div
        variants={variants}
        className="absolute bottom-0 top-0 z-[1000] flex w-64 flex-col bg-black pl-8 text-white opacity-0"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="grow">
          <div className="m-4">
            <Link href={{ pathname, query: queryStringWithoutSideBar }} replace={true}>
              <CloseOutlined />
            </Link>
          </div>

          <div key="go-to-home" className="w-full px-4 py-2">
            <Link href="/">首頁</Link>
          </div>

          {categories.map((category) => (
            <div key={category._id} className="w-full px-4 py-2">
              <Link href={`/categories/${category._id}/products`}>{category.title}</Link>
            </div>
          ))}

          {isLoading && (
            <div key="loading" className="w-full px-4 py-2">
              載入中
            </div>
          )}
        </div>

        <div className="mb-4 shrink-0">
          <BottomSection
            closeDrawer={() => {
              router.replace(pathname + '?' + queryStringWithoutSideBar)
            }}
          />
        </div>
      </motion.div>
    </AntdThemeProvider>
  )
}
