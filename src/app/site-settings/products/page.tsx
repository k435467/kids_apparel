'use client'
import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { blobImagePath } from '@/utils/image'
import { AccessChecker } from '@/components/AccessChecker'

const ProductsPage: React.FC<{}> = () => {
  const [products, setProducts] = useState<IProduct[]>([])

  const [messageApi, contextHolder] = message.useMessage()

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data: IProduct[] = await res.json()
      setProducts(data)
    } catch (e) {
      console.error(e)
      messageApi.error('初始化失敗')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="p-2">
      {contextHolder}
      <AccessChecker level="manager" />

      <div className="mb-2 flex w-full justify-end">
        <Link href="/site-settings/products/create">
          <Button>新增商品</Button>
        </Link>
      </div>
      {products.map((product) => {
        const coverImageName = product.imgNames?.[0]
        return (
          <Link
            key={product._id}
            className="mb-2 flex w-full items-center rounded-lg border border-solid border-gray-200 p-4"
            href={`products/${product._id}`}
          >
            <div className="mr-2 flex h-16 w-16 items-center justify-center">
              {coverImageName ? (
                <img
                  src={blobImagePath + coverImageName}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileImageOutlined />
              )}
            </div>
            <div className="grow">
              <div>{product.name}</div>
              <div className="text-sm font-thin text-gray-300">{product.createTime}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default ProductsPage
