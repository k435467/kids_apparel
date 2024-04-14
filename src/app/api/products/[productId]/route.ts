import clientPromise from '@/utils/database/mongoClient'
import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import { accessChecker } from '@/utils/access'
import { mdb } from '@/utils/database/collections'
import { IDocProduct } from '@/types/database'
import { FieldType as ProductEditorFieldType } from '@/components/product/ProductEditor'
import { makeColorsOrSizesDbValue, makeProductPriceMinMax } from '@/utils/product'

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const coll = (await clientPromise).db(mdb.dbName).collection<IDocProduct>(mdb.coll.products)

    const product = await coll.findOne({
      _id: new ObjectId(params.productId),
    })

    return Response.json(product)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
  const session = await getServerSession(authOptions)
  if (!accessChecker.hasManagerAccess(session?.user?.role)) {
    return Response.json({ message: accessChecker.message.forbidden }, { status: 403 })
  }

  try {
    const coll = (await clientPromise).db(mdb.dbName).collection<IDocProduct>(mdb.coll.products)

    const prod = (await req.json()) as ProductEditorFieldType

    const insertResult = await coll.updateOne(
      {
        _id: new ObjectId(params.productId),
      },
      {
        $set: {
          basePrice: prod.basePrice,
          colors: makeColorsOrSizesDbValue(prod.colors),
          coverImageName: prod.coverImageName,
          description: prod.description,
          descriptionList: prod.descriptionList,
          display: prod.display,
          imageNames: prod.imageNames,
          name: prod.name,
          price: makeProductPriceMinMax(prod.colors, prod.sizes, prod.basePrice),
          sizes: makeColorsOrSizesDbValue(prod.sizes),
          updateTime: new Date(),
        },
      },
    )

    return Response.json(insertResult)
  } catch (err) {
    return Response.json(err, { status: 500 })
  }
}
