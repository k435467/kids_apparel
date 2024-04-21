'use client'
import { useUsers } from '@/networks/users'
import { List } from 'antd'
import React from 'react'
import dayjs from 'dayjs'
import { usePagination } from '@/hooks/usePagination'

export default function ({}) {
  const { pagination, paginationProps } = usePagination()
  const { data, isLoading } = useUsers(pagination)

  return (
    <div className="m-4 mb-16">
      <List
        itemLayout="horizontal"
        dataSource={data?.data}
        loading={isLoading}
        pagination={{ total: data?.total, ...paginationProps }}
        rowKey={(v) => v._id as string}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={item.userName}
              description={`phone: ${item.phoneNumber}, email: ${item.email}, role: ${item.role}, create: ${dayjs(item.createTime).add(8, 'h').format('YYYY-MM-DD')}`}
            />
          </List.Item>
        )}
      />
    </div>
  )
}
