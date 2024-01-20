import clientPromise from '@/utils/mongodb'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const categoryId = params.categoryId

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const oId = new ObjectId(categoryId)

    const cursor = db.collection('products').find(
      { categoryId: oId },
      {
        sort: {
          _id: 1,
        },
      },
    )

    const products = await cursor.toArray()

    return Response.json(products)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
