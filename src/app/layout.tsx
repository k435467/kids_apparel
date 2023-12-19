import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider'
import NavMenu from '@/components/NavMenu'
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'
import Link from 'next/link'
import { MenuOutlined } from '@ant-design/icons'
import SideBar from '@/components/SideBar'

export const metadata: Metadata = {
  title: 'Kids Apparel',
  description: "children's clothing",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body>
        <SideBar />

        <div className="mt-2 grid h-12 w-full grid-cols-3 border-b border-black">
          <div className="ml-4 flex items-center">
            <Link href={{ query: { sideBar: 1 } }} className="flex">
              <MenuOutlined />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/">Home</Link>
          </div>
          <div className="mr-4 flex items-center justify-end">
            <div className="h-8 w-8 rounded-full bg-gray-400"></div>
          </div>
        </div>

        <SessionProvider session={session}>
          <NavMenu />
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </SessionProvider>
      </body>
    </html>
  )
}
