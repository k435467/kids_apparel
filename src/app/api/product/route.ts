import clientPromise from '@/utils/mongodb'

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

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const testProducts: IProduct[] = [
      {
        categoryId: '0',
        pricesOfVariants: [[100]],
        description: 'description',
        name: 'product name1',
        descriptionList: ['description1', 'description2'],
        imageUrls: ['imageUrls'],
        isOnShelf: true,
        sizes: ['S', 'M', 'L'],
        variants: ['variant1', 'variant2'],
      },
      {
        categoryId: '0',
        pricesOfVariants: [[100]],
        description: 'description',
        name: 'product name2',
        descriptionList: ['description1', 'description2'],
        imageUrls: ['imageUrls'],
        isOnShelf: true,
        sizes: ['S', 'M', 'L'],
        variants: ['variant1', 'variant2'],
      },
    ]

    const insertResult = await db.collection('products').insertMany(testProducts)

    return Response.json(insertResult)
  } catch (err) {
    console.error(err)
    return Response.error()
  }
}
