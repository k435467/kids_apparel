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

  const role = session.data?.user?.role

  useEffect(() => {
    let check = (r: typeof role) => false
    if (level === 'admin') check = accessChecker.hasAdminAccess
    if (level === 'manager') check = accessChecker.hasManagerAccess

    const ok = check(role)
    if (!ok) {
      router.replace('/')
    }
  }, [role, level])
}

export const AccessChecker: React.FC<{ level: UserRoleType }> = ({ level }) => {
  useAccess(level)
  return null
}
