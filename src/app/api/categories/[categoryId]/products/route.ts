import clientPromise from '@/utils/database/mongoClient'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { mdb } from '@/utils/database/collections'
import { IDocCategory, IDocProduct } from '@/types/database'
import { makePaginationAndValidate, makeProductFilter } from '@/utils/searchParams'

export interface IGetCategoryProductsResponse {
  total: number
  data: IDocProduct[]
}

export async function GET(req: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const productFilter = makeProductFilter(req.nextUrl.searchParams)
    const pagination = makePaginationAndValidate(req.nextUrl.searchParams)

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
      ...(productFilter.name || productFilter.startTime || productFilter.endTime
        ? [
            {
              $match: {
                ...(productFilter.name && {
                  name: {
                    $regex: new RegExp(productFilter.name),
                  },
                }),
                ...((productFilter.startTime || productFilter.endTime) && {
                  createTime: {
                    ...(productFilter.startTime && { $gte: new Date(productFilter.startTime) }),
                    ...(productFilter.endTime && { $lte: new Date(productFilter.endTime) }),
                  },
                }),
              },
            },
          ]
        : []),
    ]

    const coll = (await clientPromise).db(mdb.dbName).collection<IDocCategory>(mdb.coll.categories)

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
            [productFilter.sort]: productFilter.asc,
          },
        },
        {
          $limit: pagination.pageSize,
        },
        {
          $skip: pagination.pageSize * (pagination.current - 1),
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
