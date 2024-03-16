interface ISizePriceStock {
  size: string
  price: number
  // stock: number | null
}

interface IProduct {
  _id?: string
  name: string // 名稱
  isOnShelf: boolean // 上架
  isOnHomePage: boolean // 在首頁顯示
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

interface ICart<IdType> {
  _id?: IdType
  userId: IdType
  items: {
    productId: IdType
    size: string
    quantity: number
  }[]
  updateTime: Date
  createTime: Date
}

interface ICartResponse<IdType> extends ICart<IdType> {
  productData: {
    _id: IdType
    name: string
    sizes: ISizePriceStock[]
    imgName: string
  }[]
}

type OrderStatusType = '已建立' | '備貨中' | '已出貨' | '已完成'

interface IOrder<IdType, DateType> {
  _id?: IdType
  userId: IdType
  shipMethod: '7-11' | '全家' | '宅配'
  receiverInfo: {
    city: string
    district: string
    remainingAddress: string
    receiver: string
    receiverPhone: string
  }
  items: {
    productId: IdType
    size: string
    quantity: number
  }[]
  totalPrice: number
  history: { time: DateType; title: OrderStatusType }[]
  createTime?: DateType
}

interface IOrderWithProductData<IdType, DateType> extends IOrder<IdType, DateType> {
  productData: {
    _id: IdType
    name: string
    sizes: ISizePriceStock[]
    imgName: string
  }[]
}
