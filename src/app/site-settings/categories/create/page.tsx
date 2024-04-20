'use client'
import {
  CategoryEditor,
  ISiteSettingCateogriesEditService,
} from '@/components/category/CategoryEditor'
import { IDocCategory } from '@/types/database'
import { mutate } from 'swr'

export default function SiteSettingCategoryCreatePage({}: {}) {
  const service: ISiteSettingCateogriesEditService = {
    save: (setActionLoading, formValues, messageApi, router) => {
      setActionLoading(true)
      fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          title: formValues.title,
          display: formValues.display,
          sort: 0,
          createTime: new Date(),
          updateTime: new Date(),
          productIds: [],
        } as IDocCategory),
      })
        .then(async () => {
          await mutate('/api/categories', undefined, {
            revalidate: true,
          })
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
  }

  return <CategoryEditor service={service} />
}
