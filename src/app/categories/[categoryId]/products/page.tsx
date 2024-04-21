'use client'
import { Empty, Spin } from 'antd'

export default function CategoryProducts({ params }: { params: { categoryId: string } }) {
  return (
    <div className="mt-8">
      <Empty />
    </div>
  )
}

// export default function CategoryProducts({ params }: { params: { categoryId: string } }) {
//   const { categoryId } = params
//
//   const { data: products, isLoading } = useCategoryProducts(categoryId)
//
//   if (isLoading) {
//     return (
//       <div className="flex h-40 items-center justify-center">
//         <Spin />
//       </div>
//     )
//   }
//
//   if (!isLoading && products?.length === 0) {
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
