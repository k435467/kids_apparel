import bcrypt from 'bcrypt'
import clientPromise from '@/utils/mongodb'
import { NextRequest } from 'next/server'
import { saltRounds } from '@/utils/auth'

export async function POST(req: NextRequest) {
  let body: { phoneNumber: string; password: string; userName: string } | undefined

  // Deserialize & Validation
  try {
    body = await req.json()
    if (!body || body.phoneNumber.length < 10 || body.password.length < 6) {
      throw new Error('Data invalid.')
    }
  } catch (err) {
    console.error(err)
    return Response.json('Deserialize request body failed.', { status: 500 })
  }

  // DB
  const client = await clientPromise
  const userColl = client.db('kids-apparel').collection('users')

  // Check an existing user
  const existingUser = await userColl.findOne({ phoneNumber: body.phoneNumber })
  if (existingUser) {
    return Response.json('The phone number is already registered.', { status: 500 })
  }

  // Encrypt password
  let hash: string = ''
  try {
    hash = await bcrypt.hash(body.password, saltRounds)
  } catch (err) {
    console.error(err)
    return Response.json('Data process failed.', { status: 500 })
  }

  // Insert a user
  try {
    const insertResult = await userColl.insertOne({
      phoneNumber: body.phoneNumber,
      password: hash,
      userName: body.userName,
      createTime: new Date(),
    })
  } catch (err) {
    return Response.json('Database insert error.', { status: 500 })
  }

  return Response.json('success')
}
