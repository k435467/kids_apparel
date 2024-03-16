import clientPromise from '@/utils/database/mongoClient'

export async function GET() {
  try {
    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('products')

    const products = await coll
      .find({ isOnHomePage: true }, { limit: 20, sort: { _id: -1 } })
      .toArray()

    return Response.json(products)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
