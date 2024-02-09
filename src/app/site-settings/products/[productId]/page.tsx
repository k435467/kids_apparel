'use client'
import React, { useEffect, useState } from 'react'
import ProductEditor from '@/components/product/ProductEditor'
import { Form } from 'antd'
import { AccessChecker } from '@/components/AccessChecker'

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params

  const [form] = Form.useForm()
  const [imgNames, setImgNames] = useState<string[]>([])

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((value: IProduct) => {
        if (value) {
          const { imgNames, _id, ...rest } = value
          form.setFieldsValue(rest)
          setImgNames(imgNames ?? [])
        }
      })
  }, [productId])

  return (
    <>
      {/* <AccessChecker level="manager" /> */}
      <ProductEditor
        form={form}
        formSubmitRequest={(values, imgNames) => {
          return fetch('/api/products', {
            method: 'PUT',
            body: JSON.stringify({ ...values, imgNames, _id: productId }),
          })
        }}
        initImgNames={imgNames}
      />
    </>
  )
}
