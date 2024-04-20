'use client'
import { useSession } from 'next-auth/react'
import React from 'react'
import { Descriptions } from 'antd'
import type { DescriptionsProps } from 'antd'

/**
 * 使用者資料頁面
 */
export default function () {
  const { data: session } = useSession()

  const user = session?.user
  if (!user) {
    return <div>請先登入</div>
  }

  const items: DescriptionsProps['items'] = [
    {
      key: 'userName',
      label: '名稱',
      children: user.userName,
    },
    {
      key: 'phoneNumber',
      label: '手機',
      children: user.phoneNumber,
    },
    ...(user.role
      ? [
          {
            key: 'role',
            label: '角色',
            children: user.role,
          },
        ]
      : []),
  ]

  return (
    <div className="m-4">
      <Descriptions
        items={items}
        colon={false}
        layout="vertical"
        contentStyle={{ fontSize: '16px' }}
      />
    </div>
  )
}
