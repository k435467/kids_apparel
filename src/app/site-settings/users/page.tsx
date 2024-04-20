'use client'
import { useUsers } from '@/networks/users'
import { List } from 'antd'
import React, { useState } from 'react'
import { IGetMemberUsersCondition } from '@/app/api/member/users/route'
import dayjs from 'dayjs'

export default function ({}) {
  const [condition, setCondition] = useState<IGetMemberUsersCondition>({
    page: 1,
    pageSize: 10,
  })

  const { data, isLoading } = useUsers(condition)

  return (
    <div className="m-4 mb-16">
      <List
        itemLayout="horizontal"
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          current: condition.page,
          pageSize: condition.pageSize,
          onChange: (page, pageSize) => setCondition({ page, pageSize }),
        }}
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

  // return (
  //   <div className="mb-16 p-4">
  //     {users?.map((v) => {
  //       return (
  //         <div key={v._id} className="my-6">
  //           <div>{v.phoneNumber}</div>
  //           <div>{v.userName}</div>
  //           <div>{v.createTime}</div>
  //           <div>{v.role as any}</div>
  //           <Button>Add to manager</Button>
  //         </div>
  //       )
  //     })}
  //   </div>
  // )
}
