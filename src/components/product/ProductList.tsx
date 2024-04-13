'use client'
import React from 'react'
import { List, ListProps } from 'antd'
import { formatPriceRange } from '@/utils/format'
import { blobImagePath } from '@/utils/image'
import { IDocProduct } from '@/types/database'
import { CheckOutlined } from '@ant-design/icons'

export const ProductList: React.FC<{
  dataSource?: IDocProduct[]
  loading?: boolean
  pagination: ListProps<any>['pagination']
  selectedProducts?: IDocProduct[]
  onClickProduct: (selectedProduct: IDocProduct) => void
}> = ({ dataSource, loading, pagination, selectedProducts, onClickProduct }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      loading={loading}
      pagination={{
        ...pagination,
        pageSizeOptions: [5, 10, 20, 30],
      }}
      rowKey={(v) => v._id as string}
      renderItem={(item, index) => {
        const isSelected = Boolean(selectedProducts?.find((v) => v._id === item._id))
        return (
          <List.Item onClick={() => onClickProduct(item)}>
            <List.Item.Meta
              avatar={
                <div className="relative h-8 w-8 rounded-full">
                  <img
                    alt=""
                    className="h-full w-full object-cover"
                    src={`${blobImagePath}${item.coverImageName}`}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-amber-400/80">
                      <CheckOutlined className="text-lg !text-white" />
                    </div>
                  )}
                </div>
              }
              title={item.name}
              description={formatPriceRange(item.price)}
            />
          </List.Item>
        )
      }}
    />
  )
}
