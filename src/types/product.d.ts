interface ISizePriceStock {
  size: string
  price: number | null
  stock: number | null
}

interface IProduct {
  _id?: string
  name: string // 名稱
  isOnShelf: boolean // 上架
  imgNames?: string[] // 圖片
  categoryId: string // 分類
  description: string // 描述
  descriptionList: string[] // 描述清單
  // variants: string[] // 樣式
  sizes: ISizePriceStock[] // 尺寸
  // salePricesOfVariants: number[][] // 每個尺寸在不同樣式下的標價
  // regularPricesOfVariants: number[][] // 每個尺寸在不同樣式下的原價
  createTime?: string
}

interface ICategory {
  _id?: string
  isOnShelf: boolean
  title: string
  order?: number
  createTime?: Date
}

interface ICartItem {
  _id?: string
  addTime: Date
  productId: string
  size: string
  price: number
}