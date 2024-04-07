import React from 'react'
import Link from 'next/link'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { Cart } from '@/components/layout/Cart'
import Image from 'next/image'
import BubbleBubbleLogo from '@/assets/bubble-bubble-logo.png'

export const Navbar: React.FC<{}> = () => {
  return (
    <div className="mb-4 grid h-14 w-full grid-cols-3 bg-white py-1 text-black shadow-md">
      <div className="ml-4 flex items-center">
        <SidebarButton />
      </div>
      <div className="flex items-center justify-center font-thin">
        <Link href="/">
          <Image width={130} height={48} src={BubbleBubbleLogo} alt="logo" />
        </Link>
      </div>
      <div className="mr-4 flex items-center justify-end">
        <Cart />
      </div>
    </div>
  )
}
