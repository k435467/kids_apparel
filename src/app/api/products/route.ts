import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { NextRequest } from 'next/server'

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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role != 'admin') {
    return Response.json({ message: 'Please check the role of the user.' }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const products = await req.json()

    const insertResult = await db.collection('products').insertMany(products)

    return Response.json(insertResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
