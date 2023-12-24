'use client'
import { UserOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function () {
  const { data: session } = useSession()

  if (!session?.user) {
    return <div>請先登入</div>
  }

  return (
    <div>
      <div className="mt-8 flex flex-col items-center">
        {session.user.image ? (
          <img className="h-40 w-40 rounded-full" src={session.user.image} alt="" />
        ) : (
          <UserOutlined className="text-9xl" />
        )}

        <div className="mt-4 text-3xl">{session.user.name}</div>
        <div className="mt-4 text-xl">{session.user.email}</div>
      </div>
    </div>
  )
}
