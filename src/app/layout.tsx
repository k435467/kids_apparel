import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider'
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'
import Link from 'next/link'
import { Drawer } from '@/components/layout/Drawer'
import UserAvatar from '@/components/layout/UserAvatar'
import AntdThemeProvider from '@/components/AntdThemeProvider'
import { DrawerLink } from '@/components/layout/DrawerLink'
import { Cart } from '@/components/layout/Cart'

export const metadata: Metadata = {
  title: 'Kids Apparel',
  description: "children's clothing",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <AntdThemeProvider>
        <StyledComponentsRegistry>
          <SessionProvider session={session}>
            <body className="m-auto max-w-3xl">
              <div className="grid h-14 w-full grid-cols-3 bg-black py-1 text-white">
                <div className="ml-4 flex items-center">
                  <DrawerLink />
                </div>
                <div className="flex items-center justify-center">
                  <Link href="/">首頁</Link>
                </div>
                <div className="mr-4 flex items-center justify-end">
                  <Cart />
                  <UserAvatar />
                </div>
              </div>
              <Drawer />
              {children}
            </body>
          </SessionProvider>
        </StyledComponentsRegistry>
      </AntdThemeProvider>
    </html>
  )
}
