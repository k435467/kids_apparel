'use client'
import React from 'react'
import ProductEditor from '@/components/product/ProductEditor'
import { Form } from 'antd'
import { AccessChecker } from '@/components/AccessChecker'

export default function ProductsCreatePage() {
  const [form] = Form.useForm()

  return (
    <>
      {/* <AccessChecker level="manager" /> */}
      <ProductEditor
        form={form}
        formSubmitRequest={(values, imgNames) => {
          return fetch('api/products', {
            method: 'POST',
            body: JSON.stringify({ ...values, imgNames }),
          })
        }}
        initImgNames={[]}
      />
    </>
  )
}
