'use client'
import { useProducts } from '@/networks/products'
import React, { useState } from 'react'
import { IGetProductsCondition } from '@/app/api/products/route'
import { ProductCardList } from '@/components/product/ProductCardList'

export default function Home() {
  const [condition, setCondition] = useState<IGetProductsCondition>({
    page: 1,
    size: 10,
  })

  const { data, isLoading } = useProducts(condition)

  return (
    <div className="m-4">
      <ProductCardList
        products={data?.data}
        loading={isLoading}
        pagination={{
          page: condition.page!,
          pageSize: condition.size!,
        }}
      />
    </div>
  )
}

// export default function Home() {
//   const { data: products, isLoading } = useHomePageProducts()
//
//   if (isLoading) {
//     return (
//       <div className="flex h-40 items-center justify-center">
//         <Spin />
//       </div>
//     )
//   }
//
//   if (products?.length === 0) {
//     return (
//       <div className="mt-8">
//         <Empty />
//       </div>
//     )
//   }
//
//   return (
//     <div>
//       <div className="mx-1 grid grid-cols-2 gap-2">
//         {products?.map((product) => {
//           return <ProductCard key={product._id} product={product} />
//         })}
//       </div>
//     </div>
//   )
// }
