'use client'
import { UserOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * 使用者資料頁面
 */
export default function () {
  const router = useRouter()
  const { data: session } = useSession()

  const user = session?.user
  if (!user) {
    return <div>請先登入</div>
  }

  return (
    <div>
      <div className="mt-8 flex flex-col items-center">
        {user.image ? (
          <img className="h-40 w-40 rounded-full" src={user.image} alt="" />
        ) : (
          <UserOutlined className="text-9xl" />
        )}

        <div className="mt-4 text-3xl">{user.userName}</div>
        <div className="mt-4 text-xl">{user.phoneNumber}</div>
        {user.role && <div className="mt-4 text-xl">{user.role.toUpperCase()}</div>}
        <Button
          className="mt-4"
          danger
          onClick={() => {
            signOut({ redirect: false })
            router.replace('/')
          }}
        >
          登出
        </Button>
      </div>
    </div>
  )
}
