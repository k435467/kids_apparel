'use client'
import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { motion, type Variants } from 'framer-motion'
import AntdThemeProvider from '@/components/AntdThemeProvider'
import { useIsOpenSidebar } from '@/hooks/useIsOpenSidebar'

const variants: Variants = {
  open: { opacity: 1, x: '-32px' },
  closed: { opacity: 0, x: '-100%' },
}

const Backdrop: React.FC<{ onClick: () => void; open: boolean }> = ({ onClick, open }) => (
  <div
    onClick={onClick}
    className={`${
      open ? 'bg-black/10' : 'pointer-events-none bg-black/0'
    } fixed inset-0 z-[999] transition-all duration-300`}
  />
)

export const Sidebar: React.FC<{}> = ({}) => {
  const { isOpenSidebar, setIsOpenSidebar } = useIsOpenSidebar()

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
          <div className="m-4">
            <CloseOutlined onClick={() => setIsOpenSidebar(false)} />
          </div>

          {/* Member */}
          {/* Product Categories */}
          {/* Order */}
          {/* Backstage */}
        </div>
      </motion.div>
    </AntdThemeProvider>
  )
}
