import { getServerSession } from './auth-session'
import { prisma } from './prisma'

const ADMIN_DISCORD_ID = '989576730165518437'

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return false
  }

  // Get user's Discord account
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: {
        where: {
          provider: 'discord'
        }
      }
    }
  })

  if (!user || user.accounts.length === 0) {
    return false
  }

  // Check if any Discord account matches the admin ID
  return user.accounts.some(account => account.providerAccountId === ADMIN_DISCORD_ID)
}
