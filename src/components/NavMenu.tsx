'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <div>name: {session.user?.name}</div>
        <div>role: {session.user?.role}</div>
        <div>image: {session.user?.image}</div>
        <div>email: {session.user?.email}</div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div>
      <div>Not signed in</div>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

export default function NavMenu() {
  return (
    <div>
      <AuthButton />
    </div>
  )
}
