import clientPromise from '@/utils/database/mongoClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { NextRequest } from 'next/server'
import { Filter, ObjectId } from 'mongodb'
import { mdb } from '@/utils/database/collections'
import { IDocProduct } from '@/types/database'

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
    const search = req.nextUrl.searchParams
    const condition: Required<Omit<IGetProductsCondition, 'name' | 'startTime' | 'endTime'>> &
      Pick<IGetProductsCondition, 'name' | 'startTime' | 'endTime'> = {
      name: search.get('name') ?? undefined,
      startTime: search.get('startTime') ?? undefined,
      endTime: search.get('endTime') ?? undefined,
      page: parseInt(search.get('page') ?? '1'),
      size: parseInt(search.get('size') ?? '10'),
      sort: search.get('sort') ?? '_id',
      asc: parseInt(search.get('asc') ?? '-1') as 1 | -1,
    }

    if (condition.page < 1 || condition.size > 30) {
      throw new Error('Filter is invalid.')
    }

    const client = await clientPromise
    const productsColl = client.db(mdb.dbName).collection<IDocProduct>(mdb.coll.products)

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

    console.log(filter)

    const products = await productsColl
      .find(filter)
      .sort({ [condition.sort]: condition.asc })
      .limit(condition.size)
      .skip(condition.size * (condition.page - 1))
      .toArray()

    const total = await productsColl.countDocuments(filter)

    return Response.json({ total, data: products } as IGetProductsRes)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const product: IProduct = await req.json()
    const prdObjId = new ObjectId(product._id)
    const catObjId = new ObjectId(product.categoryId)

    const updateResult = await db
      .collection('products')
      .replaceOne({ _id: prdObjId }, { ...product, _id: prdObjId, categoryId: catObjId })

    return Response.json(updateResult)
  } catch (err) {
    console.error(err)
    return Response.json(err, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }
  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const products = await req.json()

    const productsWithCategoryObjectId = products.map((product: IProduct) => ({
      ...product,
      categoryId:
        typeof product.categoryId === 'string'
          ? new ObjectId(product.categoryId)
          : product.categoryId,
    }))

    const insertResult = await db.collection('products').insertMany(productsWithCategoryObjectId)

    return Response.json(insertResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
