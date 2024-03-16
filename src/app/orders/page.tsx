import { useOrders } from '@/utils/network'
import { Empty, Spin } from 'antd'
import React from 'react'

const Order: React.FC<{ order: IOrderWithProductData<string, string> }> = ({ order }) => {
  return (
    <div className="m-4 p-4">
      <div>{order._id}</div>
      <div>{order.createTime}</div>
    </div>
  )
}

export default function OrdersPage({}: {}) {
  const { data, isLoading } = useOrders()

  if (isLoading) {
    return (
      <div className="m-8 flex justify-center">
        <Spin />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="m-8 flex justify-center">
        <Empty />
      </div>
    )
  }

  return <div className="m-4">OrdersPage</div>
}
