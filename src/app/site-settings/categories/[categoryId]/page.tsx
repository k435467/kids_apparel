'use client'
import {
  ISiteSettingCateogriesEditService,
  CategoryEditor,
} from '@/components/category/CategoryEditor'
import { useCategory } from '@/networks/categories'
import { IDocCategory } from '@/types/database'
import { mutate } from 'swr'

export default function SiteSettingCategoryEditPage({
  params,
}: {
  params: { categoryId: string }
}) {
  const { data, isLoading } = useCategory(params.categoryId)

  const service: ISiteSettingCateogriesEditService = {
    save: (setActionLoading, formValues, messageApi, router) => {
      setActionLoading(true)
      fetch(`/api/categories/${params.categoryId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: formValues.title,
          display: formValues.display,
          sort: data!.sort,
          updateTime: new Date(),
        } as IDocCategory),
      })
        .then(async () => {
          await mutate('/api/categories')
          await mutate(`/api/categories/${params.categoryId}`)
          messageApi.success('成功, 返回列表...')
          setTimeout(() => {
            router.push('/site-settings/categories')
          }, 1000)
        })
        .catch((err) => {
          setActionLoading(false)
          messageApi.error('失敗')
          if (err instanceof Error) {
            messageApi.error(err.message)
          }
        })
    },
    delete: (setActionLoading, messageApi, router) => {
      setActionLoading(true)
      fetch(`/api/categories/${params.categoryId}`, {
        method: 'DELETE',
      })
        .then(async () => {
          await mutate('/api/categories')
          messageApi.success('成功, 返回列表...')
          setTimeout(() => {
            router.push('/site-settings/categories')
          }, 1000)
        })
        .catch((err) => {
          setActionLoading(false)
          messageApi.error('失敗')
          if (err instanceof Error) {
            messageApi.error(err.message)
          }
        })
    },
    addProducts: (messageApi, products) =>
      fetch(`/api/categories/${params.categoryId}/products`, {
        method: 'PATCH',
        body: JSON.stringify({
          isRemove: false,
          productIds: products.map((x) => x._id),
        }),
      })
        .then(() => {
          messageApi.success('成功')
          mutate(
            (key) =>
              typeof key === 'string' &&
              key.startsWith(`/api/categories/${params.categoryId}/products`),
          )
        })
        .catch((err) => {
          messageApi.error('失敗')
          if (err instanceof Error) {
            messageApi.error(err.message)
          }
        }),
    removeProducts: (messageApi, products) => {
      return fetch(`/api/categories/${params.categoryId}/products`, {
        method: 'PATCH',
        body: JSON.stringify({
          isRemove: true,
          productIds: products.map((x) => x._id),
        }),
      })
        .then(() => {
          messageApi.success('成功')
          mutate(
            (key) =>
              typeof key === 'string' &&
              key.startsWith(`/api/categories/${params.categoryId}/products`),
          )
        })
        .catch((err) => {
          messageApi.error('失敗')
          if (err instanceof Error) {
            messageApi.error(err.message)
          }
        })
    },
  }

  return <CategoryEditor category={data} isLoading={isLoading} service={service} />
}
