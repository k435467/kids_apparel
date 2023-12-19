import React from 'react'
import { Button } from 'antd'
import Link from 'next/link'

const SiteSettingsPage: React.FC<{}> = () => {
  return (
    <div className="container mx-auto flex flex-col gap-2 p-2">
      <Link href={'/'}>
        <Button size="large" block>
          首頁
        </Button>
      </Link>
      <Link href={'/site-settings/categories'}>
        <Button size="large" block>
          分類列表
        </Button>
      </Link>
      <Link href={'/site-settings/categories/create'}>
        <Button size="large" block>
          分類新增
        </Button>
      </Link>
      <Link href={'/site-settings/products'}>
        <Button size="large" block>
          商品列表
        </Button>
      </Link>
      <Link href={'/site-settings/products/create'}>
        <Button size="large" block>
          商品新增
        </Button>
      </Link>
    </div>
  )
}

export default SiteSettingsPage
