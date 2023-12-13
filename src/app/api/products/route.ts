import clientPromise from '@/utils/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role != 'admin') {
    return Response.json({ message: 'Please check the role of the user.' }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const db = client.db('kids-apparel')

    const testProducts: IProduct[] = [
      {
        categoryId: '0',
        pricesOfVariants: [[100]],
        description: 'description',
        name: 'product name3',
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
        name: 'product name4',
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
    return Response.json(err, { status: 500 })
  }
}
