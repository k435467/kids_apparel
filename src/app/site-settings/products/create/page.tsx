'use client'
import React from 'react'
import { ProductEditor, FieldType } from '@/components/product/ProductEditor'
import { Form } from 'antd'
import { mutate } from 'swr'

export default function ProductsCreatePage() {
  const [form] = Form.useForm<FieldType>()

  return (
    <>
      {/* <AccessChecker level="manager" /> */}
      <ProductEditor
        form={form}
        formSubmitRequest={(values) => {
          return fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify({ ...values }),
          }).then(() => {
            return mutate(
              (key) => typeof key === 'string' && key.startsWith(`/api/products`),
              undefined,
              {
                revalidate: true,
              },
            )
          })
        }}
      />
    </>
  )
}
