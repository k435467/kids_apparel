import clientPromise from '@/utils/database/mongoClient'

export async function GET() {
  try {
    const client = await clientPromise
    const coll = client.db('kids-apparel').collection('products')

    const count = await coll.countDocuments({})

    return Response.json(count)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
