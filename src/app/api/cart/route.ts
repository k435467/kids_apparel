import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return Response.json({ message: 'Please login.' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('carts')

    const userObjectId = new ObjectId(session.user.id)

    let cart = await coll.findOne<ICart<ObjectId>>({ userId: userObjectId })
    if (!cart) {
      // Set default values
      cart = {
        userId: userObjectId,
        items: [],
        updateTime: new Date(),
        createTime: new Date(),
      }
    }

    const reqBody: {
      productId: string
      size: string
      quantity: number
    } = await req.json()

    // Add quantity or push it
    const existedItem = cart.items.find(
      (v) => v.productId.toString() === reqBody.productId && v.size === reqBody.size,
    )
    if (existedItem) {
      existedItem.quantity += reqBody.quantity
    } else {
      cart.items.push({
        productId: new ObjectId(reqBody.productId),
        size: reqBody.size,
        quantity: reqBody.quantity,
      })
    }

    // Update
    const result = await coll.updateOne({ userId: userObjectId }, { $set: cart }, { upsert: true })

    return Response.json({})
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) {
    return Response.json({ message: 'Please login.' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('carts')

    const items = await coll
      .aggregate<ICartResponse<ObjectId>>([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'products',
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
                  $mergeObjects: ['$$data', { imgName: { $first: '$$data.imgNames' } }],
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

    return Response.json(items[0])
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
