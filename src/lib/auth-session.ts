import { getServerSession as getNextAuthSession } from 'next-auth/next'
import { authOptions } from './auth'

export async function getServerSession() {
  return getNextAuthSession(authOptions)
}
