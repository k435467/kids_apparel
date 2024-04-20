import clientPromise from '@/utils/database/mongoClient'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { mdb } from '@/utils/database/collections'
import { IDocCategory, IDocProduct } from '@/types/database'
import { makeGetProductsConditionAndValidate } from '@/utils/product'

export interface IGetCategoryProductsResponse {
  total: number
  data: IDocProduct[]
}

export async function GET(req: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const condition = makeGetProductsConditionAndValidate(req.nextUrl.searchParams)

    const client = await clientPromise
    const coll = client.db(mdb.dbName).collection<IDocCategory>(mdb.coll.categories)

    const pipelines = [
      {
        $match: {
          _id: new ObjectId(params.categoryId),
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productIds',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $project: {
          _id: 0,
          products: 1,
        },
      },
      {
        $unwind: {
          path: '$products',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$products',
        },
      },
      // Here got product documents
      ...(condition.name || condition.startTime || condition.endTime
        ? [
            {
              $match: {
                ...(condition.name && {
                  name: {
                    $regex: new RegExp(condition.name),
                  },
                }),
                ...((condition.startTime || condition.endTime) && {
                  createTime: {
                    ...(condition.startTime && { $gte: new Date(condition.startTime) }),
                    ...(condition.endTime && { $lte: new Date(condition.endTime) }),
                  },
                }),
              },
            },
          ]
        : []),
    ]

    const totalAggregateResult = (await coll
      .aggregate([
        ...pipelines,
        {
          $count: 'total',
        },
      ])
      .toArray()) as { total: number }[]

    const data = await coll
      .aggregate([
        ...pipelines,
        {
          $sort: {
            [condition.sort]: condition.asc,
          },
        },
        {
          $limit: condition.size,
        },
        {
          $skip: condition.size * (condition.page - 1),
        },
      ])
      .toArray()

    return Response.json({
      data,
      total: totalAggregateResult[0]?.total ?? 0,
    } as IGetCategoryProductsResponse)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { categoryId: string } }) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const coll = client.db(mdb.dbName).collection(mdb.coll.categories)

    const reqBody: {
      isRemove: boolean
      productIds: string[]
    } = await req.json()

    const result = await coll.updateOne(
      { _id: new ObjectId(params.categoryId) },
      reqBody.isRemove
        ? {
            $pull: {
              productIds: {
                $in: reqBody.productIds.map((v) => new ObjectId(v)),
              },
            },
          }
        : {
            $addToSet: {
              productIds: {
                $each: reqBody.productIds.map((v) => new ObjectId(v)),
              },
            },
          },
    )

    return Response.json(result)
  } catch (err) {
    console.error(err)
    return Response.json(err, { status: 500 })
  }
}
