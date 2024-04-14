import clientPromise from '@/utils/database/mongoClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { NextRequest } from 'next/server'
import { Filter } from 'mongodb'
import { mdb } from '@/utils/database/collections'
import { IDocProduct } from '@/types/database'
import { FieldType as ProductEditorFieldType } from '@/components/product/ProductEditor'
import {
  makeColorsOrSizesDbValue,
  makeGetProductsCondition,
  makeProductPriceMinMax,
} from '@/utils/product'

export interface IGetProductsCondition {
  name?: string
  startTime?: string
  endTime?: string
  page?: number
  size?: number
  sort?: string
  asc?: 1 | -1
}

export interface IGetProductsRes {
  total: number
  data: IDocProduct[]
}

export async function GET(req: NextRequest) {
  try {
    const condition = makeGetProductsCondition(req.nextUrl.searchParams)

    if (condition.page < 1 || condition.size > 30) {
      throw new Error('Filter is invalid.')
    }

    const coll = (await clientPromise).db(mdb.dbName).collection<IDocProduct>(mdb.coll.products)

    const filter: Filter<IDocProduct> = {
      ...(condition.name && {
        name: {
          $regex: new RegExp(condition.name, 'i'),
        },
      }),
      ...((condition.startTime || condition.endTime) && {
        createTime: {
          ...(condition.startTime && { $gte: new Date(condition.startTime) }),
          ...(condition.endTime && { $lte: new Date(condition.endTime) }),
        },
      }),
    }

    const products = await coll
      .find(filter)
      .sort({ [condition.sort]: condition.asc })
      .limit(condition.size)
      .skip(condition.size * (condition.page - 1))
      .toArray()

    const total = await coll.countDocuments(filter)

    return Response.json({ total, data: products } as IGetProductsRes)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const coll = (await clientPromise).db(mdb.dbName).collection<IDocProduct>(mdb.coll.products)

    const prod = (await req.json()) as ProductEditorFieldType

    const insertResult = await coll.insertOne({
      basePrice: prod.basePrice,
      colors: makeColorsOrSizesDbValue(prod.colors),
      coverImageName: prod.coverImageName,
      createTime: new Date(),
      description: prod.description,
      descriptionList: prod.descriptionList,
      display: prod.display,
      imageNames: prod.imageNames,
      name: prod.name,
      price: makeProductPriceMinMax(prod.colors, prod.sizes, prod.basePrice),
      sizes: makeColorsOrSizesDbValue(prod.sizes),
      updateTime: new Date(),
    })

    return Response.json(insertResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
