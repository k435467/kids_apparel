import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider'
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
  const session = await getServerSession()

  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <SessionProvider session={session}>
          <body>
            <Drawer />

            <div className="mt-1 grid h-12 w-full grid-cols-3 border-b border-black">
              <div className="ml-4 flex items-center">
                <Link href={{ query: { sideBar: 1 } }} className="flex">
                  <MenuOutlined />
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <Link href="/">Home</Link>
              </div>
              <div className="mr-4 flex items-center justify-end">
                <UserAvatar />
              </div>
            </div>

            {children}
          </body>
        </SessionProvider>
      </StyledComponentsRegistry>
    </html>
  )
}
