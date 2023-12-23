'use client'
import React from 'react'
import { signIn, useSession } from 'next-auth/react'
import { LoginOutlined, UserOutlined } from '@ant-design/icons'

export default function () {
  const { data: session } = useSession()

  return (
    <>
      {session?.user ? (
        <>
          {session.user.image ? (
            <img className="h-8 w-8 rounded-full" src={session.user.image} alt="" />
          ) : (
            <UserOutlined />
          )}
        </>
      ) : (
        <LoginOutlined onClick={() => signIn()} />
      )}
    </>
  )
}
