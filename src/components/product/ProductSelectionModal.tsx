'use client'
import React, { useState } from 'react'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  ConfigProvider,
  List,
  ListProps,
  Select,
} from 'antd'
import { Dayjs } from 'dayjs'
import { useProducts } from '@/networks/products'
import { IGetProductsCondition } from '@/app/api/products/route'
import { formatDayjsToUTCDayEnd, formatDayjsToUTCDayStart, formatPriceRange } from '@/utils/format'
import { blobImagePath } from '@/utils/image'
import { IDocProduct } from '@/types/database'
import { CheckOutlined } from '@ant-design/icons'

type FieldType = {
  title?: string
  startTime?: Dayjs
  endTime?: Dayjs
  sort?: string
  asc?: 1 | -1
}

const sortSelectOptions = [
  {
    label: '建立時間',
    value: '_id',
  },
  {
    label: '更新時間',
    value: 'updateTime',
  },
  {
    label: '最低售價',
    value: 'price.min',
  },
  {
    label: '最高售價',
    value: 'price.max',
  },
]

const ascSelectOptions = [
  {
    label: '由小到大',
    value: 1,
  },
  {
    label: '由大到小',
    value: -1,
  },
]

const SearchForm: React.FC<{ onFinish: (values: FieldType) => void }> = ({ onFinish }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            itemMarginBottom: 8,
          },
        },
      }}
    >
      <Form
        size="small"
        onFinish={onFinish}
        initialValues={{
          sort: '_id',
          asc: -1,
        }}
      >
        <Form.Item<FieldType> label="名稱" name="title">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="建立時間">
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="startTime" noStyle>
              <DatePicker placeholder="開始時間" />
            </Form.Item>
            <Form.Item name="endTime" noStyle>
              <DatePicker placeholder="結束時間" />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item<FieldType> label="排序">
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="sort" noStyle>
              <Select options={sortSelectOptions} />
            </Form.Item>
            <Form.Item name="asc" noStyle>
              <Select options={ascSelectOptions} />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item>
          <Button className="mt-2" htmlType="submit" type="primary">
            查詢
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  )
}

export const ProductList: React.FC<{
  dataSource?: IDocProduct[]
  loading?: boolean
  pagination: ListProps<any>['pagination']
  selectedProducts: IDocProduct[]
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
        const isSelected = Boolean(selectedProducts.find((v) => v._id === item._id))
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

export const ProductSelectionModal: React.FC<{
  open: boolean
  onCancel: () => void
  onFinish: (v: IDocProduct[]) => Promise<any>
}> = ({ open, onCancel, onFinish }) => {
  const [condition, setCondition] = useState<IGetProductsCondition>({})
  const { data, isLoading } = useProducts(condition)
  const [selectedProducts, setSelectedProducts] = useState<IDocProduct[]>([])
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  return (
    <Modal
      title="選擇商品"
      open={open}
      confirmLoading={actionLoading}
      onCancel={() => {
        onCancel()
        setSelectedProducts([])
      }}
      onOk={async () => {
        setActionLoading(true)
        await onFinish(selectedProducts)
        setActionLoading(false)
        onCancel()
        setSelectedProducts([])
      }}
    >
      <SearchForm
        onFinish={(v) => {
          setCondition({
            ...condition,
            ...v,
            name: v.title && v.title.length > 0 ? v.title : undefined,
            startTime: formatDayjsToUTCDayStart(v.startTime),
            endTime: formatDayjsToUTCDayEnd(v.endTime),
          })
        }}
      />
      <ProductList
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          total: data?.total,
          current: condition.page ?? 1,
          pageSize: condition.size ?? 10,
          onChange: (page, pageSize) => {
            setCondition((v) => ({
              ...v,
              page: pageSize == v.size ? page : 1,
              size: pageSize,
            }))
          },
        }}
        selectedProducts={selectedProducts}
        onClickProduct={(v) => {
          if (selectedProducts.find((x) => x._id === v._id)) {
            setSelectedProducts((x) => x.filter((y) => y._id !== v._id))
          } else {
            setSelectedProducts((x) => [...x, v])
          }
        }}
      />
    </Modal>
  )
}
