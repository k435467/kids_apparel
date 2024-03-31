'use client'
import React from 'react'
import { Button, DatePicker, Form, Input, Modal } from 'antd'
import { Dayjs } from 'dayjs'

type FieldType = {
  title?: string
  startTime?: Dayjs
  endTime?: Dayjs
}

export const ProductSelectionModal: React.FC<{ open: boolean; onCancel: () => void }> = ({
  open,
  onCancel,
}) => {
  return (
    <Modal open={open} onCancel={onCancel} title="選擇商品">
      <Form>
        <Form.Item<FieldType> label="名稱" name="title">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="建立時間" name="startTime">
          <DatePicker placeholder="開始時間" />
        </Form.Item>
        <Form.Item<FieldType> noStyle name="endTime">
          <DatePicker placeholder="結束時間" />
        </Form.Item>
        <Form.Item>
          <Button className="mt-8" htmlType="submit" type="primary">
            查詢
          </Button>
        </Form.Item>
      </Form>
      {/* Product list */}
      {/* TODO - GET API search params, useSWR to fetch products */}
    </Modal>
  )
}
