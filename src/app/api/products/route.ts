import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') ?? '1')
    if (page < 1) {
      throw new Error('Page is invalid.')
    }

    const client = await clientPromise
    const db = client.db('kids-apparel')

    const products = await db
      .collection('products')
      .find({}, { sort: { _id: -1 }, limit: 10, skip: 10 * (page - 1) })
      .toArray()

    return Response.json(products)
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
