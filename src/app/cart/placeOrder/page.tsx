'use client'
import React, { useState } from 'react'
import { ShipMethodType } from '@/utils/misc'
import { Button, Form, Input, message, Select } from 'antd'
import { cityOptions, districtOptions } from '@/utils/geography'

type FieldType = {
  shipMethod: ShipMethodType
  city: string | null
  district: string | null
  remainingAddress: string
  receiver: string
  receiverPhone: string
}

const formInitValues: Partial<FieldType> = {
  shipMethod: '7-11',
}

const highlighted = '!border-amber-400 !font-bold text-amber-400'

const ShipMethodInput: React.FC<{
  value?: ShipMethodType
  onChange?: (v: ShipMethodType) => void
}> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {(['7-11', '全家', '宅配'] as ShipMethodType[]).map((v) => (
        <div
          key={v}
          className={`flex cursor-pointer items-center justify-center rounded-lg p-4 font-light ${value === v && highlighted}`}
          style={{ border: '1px solid rgba(0,0,0,.3)' }}
          onClick={() => onChange?.(v)}
        >
          {v}
        </div>
      ))}
    </div>
  )
}

/**
 * 下單頁面
 * 1. 選擇物流方式：超商取貨, 宅配
 * 2. 收件人資訊
 */
export default function PlaceOrderPage({}: {}) {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<FieldType>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const selectedCity = Form.useWatch('city', form)

  return (
    <div className="mb-20 p-4">
      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        initialValues={formInitValues}
        onFinish={(values) => {
          setIsLoading(true)
          fetch('/api/orders', { method: 'POST', body: JSON.stringify(values) })
            .then(() => {
              messageApi.success('成功')
            })
            .catch((e) => {
              console.error(e)
              messageApi.error('失敗')
            })
            .finally(() => {
              setIsLoading(false)
            })
        }}
      >
        <Form.Item<FieldType> label="物流方式" name="shipMethod">
          <ShipMethodInput />
        </Form.Item>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Form.Item<FieldType>
            label="縣市"
            name="city"
            rules={[{ required: true, message: '必填' }]}
          >
            <Select
              options={cityOptions}
              onChange={(v) => {
                form.setFieldValue('district', districtOptions(v)[0]?.value ?? null)
              }}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="鄉鎮市區"
            name="district"
            rules={[{ required: true, message: '必填' }]}
          >
            <Select options={districtOptions(selectedCity)} />
          </Form.Item>
        </div>
        <Form.Item<FieldType>
          label="地址 (不包含縣市鄉鎮市區)"
          name="remainingAddress"
          rules={[{ required: true, message: '必填' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="收件人姓名"
          name="receiver"
          rules={[{ required: true, message: '必填' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="收件人電話"
          name="receiverPhone"
          rules={[{ required: true, message: '必填' }]}
        >
          <Input />
        </Form.Item>
        <Button className="mt-8" block type="primary" htmlType="submit" loading={isLoading}>
          確定
        </Button>
      </Form>
    </div>
  )
}
