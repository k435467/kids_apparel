import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import clientPromise from '@/utils/database/mongoClient'
import { ObjectId } from 'mongodb'
import { mdb } from '@/utils/database/collections'

/**
 * Insert an order
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) {
    return Response.json({ message: 'Please login.' }, { status: 401 })
  }

  try {
    const db = (await clientPromise).db(mdb.dbName)
    const orderColl = db.collection(mdb.coll.orders)
    const cartColl = db.collection(mdb.coll.carts)

    // Get cart items
    const cartItems = await cartColl.findOne<{ items: ICart<string>['items'] }>(
      { _id: new ObjectId(userId) },
      {
        projection: { items: 1 },
      },
    )

    if (!cartItems) throw new Error('cart is empty')

    // Insert an order

    const reqBody: IOrder<string, string>['receiverInfo'] & {
      shipMethod: IOrder<string, string>['shipMethod']
    } = await req.json()

    const newDoc: IOrder<ObjectId, Date> = {
      receiverInfo: reqBody,
      shipMethod: reqBody.shipMethod,
      userId: new ObjectId(userId),
      history: [{ time: new Date(), title: '已建立' }],
      totalPrice: 0,
      items: cartItems.items.map((v) => ({ ...v, productId: new ObjectId(v.productId) })),
      createTime: new Date(),
    }

    const result = await orderColl.insertOne(newDoc)

    return Response.json(result)
  } catch (e) {
    return Response.json(e, { status: 500 })
  }
}

/**
 * Get orders
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) {
    return Response.json({ message: 'Please login.' }, { status: 401 })
  }

  try {
    const coll = (await clientPromise).db(mdb.dbName).collection(mdb.coll.orders)

    // const result = await coll
    //   .find<IOrder<ObjectId>>({ userId: new ObjectId(userId) })
    //   .limit(10)
    //   .sort({ createTime: -1 })
    //   .toArray()

    const result = await coll
      .aggregate([
        { $match: { _id: new ObjectId(userId) } },
        {
          $lookup: {
            from: mdb.coll.products,
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productData',
          },
        },
        {
          $addFields: {
            productData: {
              $map: {
                input: '$productData',
                as: 'data',
                in: {
                  $mergeObjects: [
                    '$$data',
                    {
                      imgName: {
                        $first: '$$data.imgNames',
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $unset: [
            'productData.description',
            'productData.descriptionList',
            'productData.categoryId',
            'productData.isOnShelf',
            'productData.isOnHomePage',
            'productData.imgNames',
          ],
        },
      ])
      .toArray()

    return Response.json(result)
  } catch (e) {
    return Response.json(e, { status: 500 })
  }
}
