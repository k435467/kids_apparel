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
import Script from 'next/script'
import OneTapSignin from '@/components/layout/OneTapSignin'

export const metadata: Metadata = {
  title: 'Kids Apparel',
  description: "children's clothing",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <head>
        <Script src="https://accounts.google.com/gsi/client" />
      </head>
      <StyledComponentsRegistry>
        <SessionProvider session={session}>
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
                <OneTapSignin />
                <UserAvatar />
              </div>
            </div>

            <Drawer />

            {children}
          </body>
        </SessionProvider>
      </StyledComponentsRegistry>
    </html>
  )
}
