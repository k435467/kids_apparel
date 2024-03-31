'use client'
import React from 'react'
import { CloseOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { motion, type Variants } from 'framer-motion'
import AntdThemeProvider from '@/components/AntdThemeProvider'
import { useIsOpenSidebar } from '@/hooks/useIsOpenSidebar'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCategories } from '@/networks/categories'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { accessChecker } from '@/utils/access'

const LoginLogout: React.FC<{}> = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const isLoggedIn = session?.user

  return (
    <div className="mx-4 text-sm text-neutral-400">
      {isLoggedIn ? (
        <div className="flex gap-6">
          <Link className="flex gap-2 py-2" href="/member">
            <UserOutlined />
            <div>會員中心</div>
          </Link>
          <div
            className="flex gap-2 py-2"
            onClick={() => {
              signOut({ redirect: false }).then(() => router.replace('/'))
            }}
          >
            <LogoutOutlined className="text-sm" />
            <div>登出</div>
          </div>
        </div>
      ) : (
        <Link className="flex gap-2 py-2" href="/member/sign-in">
          <UserOutlined />
          <div>登入 / 註冊</div>
        </Link>
      )}
    </div>
  )
}

const Backdrop: React.FC<{ onClick: () => void; open: boolean }> = ({ onClick, open }) => (
  <div
    onClick={onClick}
    className={`${
      open ? 'bg-black/10' : 'pointer-events-none bg-black/0'
    } fixed inset-0 z-[999] transition-all duration-300`}
  />
)

const variants: Variants = {
  open: { opacity: 1, x: '-32px' },
  closed: { opacity: 0, x: '-100%' },
}

const useMenuItems = (): MenuProps['items'] => {
  const router = useRouter()
  const { data: session } = useSession()
  const { data: categories, isLoading: isLoadingCategories } = useCategories()

  return [
    {
      key: 'categories',
      label: '商品',
      children: isLoadingCategories
        ? [
            {
              key: 'loading',
              label: '載入中...',
            },
          ]
        : categories?.map((v) => ({
            key: v._id as string,
            label: v.title,
            onClick: () => router.push(`/categories/${v._id}/products`),
          })),
    },
    ...(session?.user
      ? [
          {
            key: 'orders',
            label: '訂單',
            onClick: () => router.push('/orders'),
          },
        ]
      : []),
    ...(accessChecker.hasManagerAccess(session?.user?.role)
      ? [
          {
            key: 'site-settings',
            label: '後台',
            children: [
              {
                key: 'setting-categories',
                label: '分類',
                onClick: () => router.push('/site-settings/categories'),
              },
              {
                key: 'setting-product',
                label: '商品',
                onClick: () => router.push('/site-settings/products'),
              },
              {
                key: 'setting-users',
                label: '使用者',
                onClick: () => router.push('/site-settings/users'),
              },
            ],
          },
        ]
      : []),
  ]
}

/**
 * For login, logout, navigation menu
 */
export const Sidebar: React.FC<{}> = ({}) => {
  const { isOpenSidebar, setIsOpenSidebar } = useIsOpenSidebar()

  const menuItems = useMenuItems()

  return (
    <AntdThemeProvider>
      <Backdrop onClick={() => setIsOpenSidebar(false)} open={isOpenSidebar} />

      {/* Drawer */}
      <motion.div
        variants={variants}
        className="fixed bottom-0 top-0 z-[1000] flex w-64 flex-col bg-white pl-8 text-black opacity-0"
        animate={isOpenSidebar ? 'open' : 'closed'}
      >
        <div>
          <div className="m-4 mb-2">
            <CloseOutlined onClick={() => setIsOpenSidebar(false)} />
          </div>

          <LoginLogout />

          <Menu className="mt-4" mode="inline" items={menuItems} defaultOpenKeys={['categories']} />
        </div>
      </motion.div>
    </AntdThemeProvider>
  )
}
