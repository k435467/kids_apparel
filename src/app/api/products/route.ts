import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const products = await db.collection('products').find({}).limit(10).toArray()

    return Response.json(products)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const product: IProduct = await req.json()
    const oId = new ObjectId(product._id)

    const updateResult = await db
      .collection('products')
      .replaceOne({ _id: oId }, { ...product, _id: oId })

    return Response.json(updateResult)
  } catch (err) {
    console.error(err)
    return Response.json(err, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role != 'admin') {
    return Response.json({ message: 'Please check the role of the user.' }, { status: 403 })
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
