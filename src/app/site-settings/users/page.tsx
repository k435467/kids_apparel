'use client'
import { useUsers } from '@/utils/network'
import { Spin, Empty, Button } from 'antd'
import React from 'react'

export default function ({}) {
  const { users, isLoading } = useUsers()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (users?.length === 0) {
    return (
      <div className="mt-8">
        <Empty />
      </div>
    )
  }

  return (
    <div className="mb-16 p-4">
      {users?.map((v) => {
        return (
          <div key={v._id} className="my-6">
            <div>{v.phoneNumber}</div>
            <div>{v.userName}</div>
            <div>{v.createTime}</div>
            <div>{v.role as any}</div>
            <Button>Add to manager</Button>
          </div>
        )
      })}
    </div>
  )
}
