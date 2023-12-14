interface IProduct {
  id?: string
  name: string // 名稱
  isOnShelf: boolean // 上架
  imageUrls: string[] // 圖片
  categoryId: string // 分類
  description: string // 描述
  descriptionList: string[] // 描述清單
  variants: string[] // 樣式
  sizes: string[] // 尺寸
  salePricesOfVariants: number[][] // 每個尺寸在不同樣式下的標價
  regularPricesOfVariants: number[][] // 每個尺寸在不同樣式下的原價
  createTime?: string
}

interface ICategory {
  id?: string
  name: string
  createTime?: string
}
