'use client'
import React, { useEffect } from 'react'
import { ProductEditor, FieldType } from '@/components/product/ProductEditor'
import { Form } from 'antd'
import { IDocProduct } from '@/types/database'
import { mutate } from 'swr'
import { makeInitOfColorsOrSizes } from '@/utils/product'

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params

  const [form] = Form.useForm<FieldType>()

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((v: IDocProduct) => {
        if (v) {
          form.setFieldsValue({
            basePrice: v.basePrice,
            colors: makeInitOfColorsOrSizes(v.colors),
            coverImageName: v.coverImageName,
            description: v.description,
            descriptionList: v.descriptionList,
            display: v.display,
            imageNames: v.imageNames,
            name: v.name,
            sizes: makeInitOfColorsOrSizes(v.sizes),
          })
        }
      })
  }, [productId])

  return (
    <>
      {/* <AccessChecker level="manager" /> */}
      <ProductEditor
        form={form}
        formSubmitRequest={(values) => {
          return fetch(`/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(values),
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
