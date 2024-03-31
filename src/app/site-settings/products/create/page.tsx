'use client'
import React from 'react'
import ProductEditor from '@/components/product/ProductEditor'
import { Form } from 'antd'
import { mutate } from 'swr'

export default function ProductsCreatePage() {
  const [form] = Form.useForm()

  return (
    <>
      {/* <AccessChecker level="manager" /> */}
      <ProductEditor
        form={form}
        formSubmitRequest={(values, imgNames) => {
          mutate('/api/products/count')
          return fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify({ ...values, imgNames }),
          })
        }}
        initImgNames={[]}
      />
    </>
  )
}
