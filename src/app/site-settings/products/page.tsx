'use client'
import React from 'react'
import { Button, Empty, Pagination, Spin } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { blobImagePath } from '@/utils/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useProductTotalCount, useProducts } from '@/utils/network'
import { createUrl } from '@/utils/navigation'

const ProductsPage: React.FC<{}> = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') ?? '1')

  const { data: productTotalCount } = useProductTotalCount()

  const { data: products, isLoading } = useProducts(page)

  return (
    <div className="p-2">
      <div className="mb-2 flex w-full justify-end">
        <Link href="/site-settings/products/create">
          <Button>新增商品</Button>
        </Link>
      </div>

      <div className="flex justify-center">
        <Pagination
          defaultCurrent={1}
          current={page}
          total={productTotalCount}
          simple
          onChange={(p, s) => {
            router.push(createUrl(pathname, searchParams, { set: { page: p.toString() } }))
          }}
        />
      </div>

      <div className="mt-2">
        {isLoading && (
          <div className="flex h-40 items-center justify-center">
            <Spin />
          </div>
        )}

        {!isLoading && products?.length === 0 && (
          <div className="mt-8">
            <Empty />
          </div>
        )}

        {products?.map((product) => {
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
    </div>
  )
}

export default ProductsPage
