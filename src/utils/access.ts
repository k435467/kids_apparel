export type UserRoleType = 'admin' | 'manager'

export const accessChecker = {
  hasAdminAccess: (role: string | undefined) => role === 'admin',
  hasManagerAccess: (role: string | undefined) => role === 'admin' || role === 'manager',
  message: {
    forbidden: 'Please check the role of the user.',
  },
}
