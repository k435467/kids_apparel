import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import clientPromise from '@/utils/database/mongoClient'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { NextRequest } from 'next/server'
import { mdb } from '@/utils/database/collections'
import { IDocCategory } from '@/types/database'

export async function GET(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const coll = client.db(mdb.dbName).collection<IDocCategory>(mdb.coll.categories)

    const result = await coll.findOne({ _id: new ObjectId(params.categoryId) })

    return Response.json(result)
  } catch (err) {
    console.error(err)
    return Response.json(err, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const coll = client.db(mdb.dbName).collection(mdb.coll.categories)

    const deleteResult = await coll.deleteOne({ _id: new ObjectId(params.categoryId) })

    return Response.json(deleteResult)
  } catch (err) {
    console.error(err)
    return Response.json(err, { status: 500 })
  }
}
