'use client'
import { SiteSettingCategoriesEdit } from '@/components/category/setting'
import { useCategory } from '@/networks/categories'

export default function SiteSettingCategoryEditPage({
  params,
}: {
  params: { categoryId: string }
}) {
  const { data, isLoading } = useCategory(params.categoryId)

  return <SiteSettingCategoriesEdit category={data} isLoading={isLoading} />
}
