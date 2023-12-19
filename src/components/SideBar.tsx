'use client'
import React, { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { CloseOutlined } from '@ant-design/icons'
import Link from 'next/link'

const SideBar: React.FC<{}> = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isOpened = searchParams.get('sideBar') === '1'

  const queryStringWithoutSideBar = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('sideBar')
    return params.toString()
  }, [searchParams])

  return (
    <div
      className={`${
        isOpened ? 'opacity-70' : 'pointer-events-none opacity-0'
      } absolute inset-0 z-10 bg-white transition-opacity duration-500`}
    >
      SideBar
      <Link href={{ pathname, query: queryStringWithoutSideBar }}>
        <CloseOutlined />
      </Link>
    </div>
  )
}

export default SideBar
