import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'
import Link from 'next/link'
import { MenuOutlined } from '@ant-design/icons'
import Drawer from '@/components/layout/Drawer'
import UserAvatar from '@/components/layout/UserAvatar'

export const metadata: Metadata = {
  title: 'Kids Apparel',
  description: "children's clothing",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <body>
          <div className="grid h-14 w-full grid-cols-3 bg-black py-1 text-white">
            <div className="ml-4 flex items-center">
              <Link href={{ query: { sideBar: 1 } }} replace={true} className="flex">
                <MenuOutlined />
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <Link href="/">首頁</Link>
            </div>
            <div className="mr-4 flex items-center justify-end">
              <UserAvatar />
            </div>
          </div>

          <Drawer />

          {children}
        </body>
      </StyledComponentsRegistry>
    </html>
  )
}
