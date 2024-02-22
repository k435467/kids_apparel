'use client'
import React from 'react'
import { useCart } from '@/utils/network'
import { useSession } from 'next-auth/react'
import { ShoppingCartOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Badge } from 'antd'

export const Cart: React.FC<{}> = () => {
  const { data: session } = useSession()
  const { data } = useCart()

  return (
    <Link href="/cart" className="mr-6">
      <ShoppingCartOutlined />
      <Badge className="!absolute" size="small" count={data?.items?.length} />
    </Link>
  )
}
