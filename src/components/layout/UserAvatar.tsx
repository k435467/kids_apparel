'use client'
import React from 'react'
import { signIn, useSession } from 'next-auth/react'
import { LoginOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link'

export default function () {
  const { data: session } = useSession()

  return (
    <>
      {session?.user ? (
        <Link href="/member">
          {session.user.image ? (
            <img className="h-8 w-8 rounded-full" src={session.user.image} alt="" />
          ) : (
            <UserOutlined />
          )}
        </Link>
      ) : (
        <button className="flex items-center bg-transparent" onClick={() => signIn()}>
          <LoginOutlined />
          <div className="ml-2">登入</div>
        </button>
      )}
    </>
  )
}
