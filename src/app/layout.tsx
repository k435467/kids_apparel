import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider'
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'
import { Sidebar } from '@/components/layout/Sidebar'
import AntdThemeProvider from '@/components/AntdThemeProvider'
import { Navbar } from '@/components/layout/Navbar'

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
              <Navbar />

              <Sidebar />

              {children}
            </body>
          </SessionProvider>
        </StyledComponentsRegistry>
      </AntdThemeProvider>
    </html>
  )
}
