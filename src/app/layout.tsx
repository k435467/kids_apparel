import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Sidebar } from '@/components/layout/Sidebar'
import AntdThemeProvider from '@/components/AntdThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Kids Apparel',
  description: "children's clothing",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang="tw">
      <AntdRegistry>
        <AntdThemeProvider>
          <SessionProvider session={session}>
            <body className="m-auto max-w-3xl">
              <Navbar />

              <Sidebar />

              <div className="min-h-screen">{children}</div>

              <Footer />
            </body>
          </SessionProvider>
        </AntdThemeProvider>
      </AntdRegistry>
    </html>
  )
}
