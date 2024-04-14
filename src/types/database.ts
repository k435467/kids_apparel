import { ObjectId } from 'mongodb'

export type UserRoleType = 'admin' | 'manager'
export type ShipMethodType = '7-11' | '全家' | '宅配'
export type OrderStatusType = '已建立' | '備貨中' | '已出貨' | '已完成'

export interface IDocUser {
  _id?: ObjectId | string
  createTime: Date | string
  password: string
  phoneNumber: string
  email: string
  role?: UserRoleType
  userName: string
  birthday: {
    year: number
    month: number
    day: number
  }
}

export interface IDocRecipient {
  _id?: ObjectId | string
  address: {
    city: string
    dist: string
    st: string
  }
  createTime: Date | string
  name: string
  phoneNumber: string
  type: ShipMethodType
  userId: ObjectId | string
}

export interface IDocCategory {
  _id?: ObjectId | string
  createTime: Date | string
  display: boolean
  productIds: (ObjectId | string)[]
  sort: number
  title: string
  updateTime: Date | string
}

export interface IDocProduct {
  _id?: ObjectId | string
  coverImageName: string
  createTime: Date | string
  description: string
  descriptionList: string[]
  display: boolean
  imageNames: string[]
  name: string
  price: {
    min: number
    max: number
  }
  basePrice: number
  colors: {
    id: string
    name: string
    priceAdjust?: number
  }[]
  sizes: {
    id: string
    name: string
    priceAdjust?: number
  }[]
  updateTime: Date | string
}

export interface IDocCart {
  _id?: ObjectId | string // userId
  createTime: Date | string
  items: {
    productId: ObjectId | string
    quantity: number
    specId: string
  }[]
  updateTime: Date | string
}

export interface IDocOrder {
  _id?: ObjectId | string
  createTime: Date | string
  items: {
    productId: ObjectId | string
    coverImageName: string
    name: string
    price: number
    spec: string
    quantity: number
  }[]
  recipient: {
    address: {
      city: string
      dist: string
      st: string
    }
    name: string
    phone: string
  }
  shipMethod: ShipMethodType
  statusHistories: {
    time: Date | string
    title: OrderStatusType
  }[]
  totalPrice: number
  userId: ObjectId | string
}
