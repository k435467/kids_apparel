'use client'
import React from 'react'
import { Button, DatePicker, Form, Input, ConfigProvider, Select } from 'antd'
import { Dayjs } from 'dayjs'
import { IGetProductsCondition } from '@/app/api/products/route'
import { formatDayjsToUTCDayEnd, formatDayjsToUTCDayStart } from '@/utils/format'

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

/**
 * @param setCondition Called in Form.onFinish.
 * @param onFinish Additional callback to run.
 */
export const SearchForm: React.FC<{
  setCondition: React.Dispatch<React.SetStateAction<IGetProductsCondition>>
  onFinish?: (values: FieldType) => void
}> = ({ setCondition, onFinish }) => {
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
        onFinish={(v) => {
          setCondition((oldValues) => ({
            ...oldValues,
            ...v,
            name: v.title && v.title.length > 0 ? v.title : undefined,
            startTime: formatDayjsToUTCDayStart(v.startTime),
            endTime: formatDayjsToUTCDayEnd(v.endTime),
          }))
          onFinish?.(v)
        }}
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
