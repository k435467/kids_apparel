import clientPromise from '@/utils/database/mongoClient'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  const productId = params.productId

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const oId = new ObjectId(productId)

    const product = await db.collection('products').findOne({ _id: oId })

    return Response.json(product)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
