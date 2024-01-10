import React from 'react'
import { Button } from 'antd'
import Link from 'next/link'

const SiteSettingsPage: React.FC<{}> = () => {
  return (
    <div className="container mx-auto flex flex-col gap-4 p-2 pt-4">
      <Link href={'/'}>
        <Button size="large" block>
          首頁
        </Button>
      </Link>
      <Link href={'/site-settings/categories'}>
        <Button size="large" block>
          商品分類
        </Button>
      </Link>
      <Link href={'/site-settings/products'}>
        <Button size="large" block>
          商品列表
        </Button>
      </Link>
    </div>
  )
}

export default SiteSettingsPage
