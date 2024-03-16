import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import clientPromise from '@/utils/database/mongoClient'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'

export async function DELETE(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  if (params.categoryId.length < 1) {
    return Response.json({ message: 'Params is invalid.' }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const objectId = new ObjectId(params.categoryId)

    const deleteResult = await db.collection('categories').deleteOne({ _id: objectId })

    return Response.json(deleteResult)
  } catch (err) {
    console.error(err)
    return Response.json(err, { status: 500 })
  }
}
