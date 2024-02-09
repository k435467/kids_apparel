'use client'
import { UserRoleType, accessChecker } from '@/utils/access'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

/**
 * @param level - Allowed user level.
 * If the current user does not reach the target level,
 * jump back to the home page.
 */
const useAccess = (level: UserRoleType) => {
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    console.log(session)
    if (session.status === 'loading') {
      return
    }
    const role = session.data?.user?.role
    let check = (r: typeof role) => false
    if (level === 'manager') check = accessChecker.hasManagerAccess
    else if (level === 'admin') check = accessChecker.hasAdminAccess

    const ok = check(role)
    if (!ok) {
      console.log('access denied.')
      router.replace('/')
    }
  }, [level, session.status])
}

export const AccessChecker: React.FC<{ level: UserRoleType }> = ({ level }) => {
  useAccess(level)
  return null
}
