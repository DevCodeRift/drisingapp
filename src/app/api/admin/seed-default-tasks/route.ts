import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { TaskCategory, ResetType } from '@/types/tasks'
import { authOptions } from '@/lib/auth'

const defaultTasks = [
  // Daily Tasks
  { title: 'Daily Commissions', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Haven Cat Gift', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'PVP Card Game Chest Energy (5)', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'PVE Card Game Chest Energy (10, 3 high value)', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Sparrow Racing Chest Energy (5)', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Iron Commander Tickets (3)', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Talk to Wu Ming (5 Black Market Favor)', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Daily Bounties', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Buy cheap Seasonal Engram', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Complete daily Pack Quests', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },
  { title: 'Complete daily Mentor tasks', category: TaskCategory.DAILY, resetType: ResetType.DAILY_2AM_UTC },

  // Weekly Tasks
  { title: 'Use your 3 Challenger Keys', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Use your free Shifting Gates Run', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Weekly Shifting Gates Quests', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Shifting Gates Exchange', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Fishing Exchange', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Complete Legendary Campaign Weekly Challenges', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Complete Gauntlet Onslaught Weekly Rewards', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: "Check Wu Ming's new Card Shop offers", category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: "Check Wu Ming's Black Market offers (Fri/Mon)", category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Complete Black Market Bounties and sell materials', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Get free Lumia Leaves from Silver Shop', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Casual Activeness Points', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Iron Bar Chest Energy (Weekends only)', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Complete weekly Battle Pass Quests', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },
  { title: 'Complete weekly Pack Quests', category: TaskCategory.WEEKLY, resetType: ResetType.WEEKLY_MONDAY },

  // Fortnight Tasks
  { title: 'Complete The Expanse', category: TaskCategory.FORTNIGHT, resetType: ResetType.FORTNIGHT },
  { title: 'Complete Calamity Ops', category: TaskCategory.FORTNIGHT, resetType: ResetType.FORTNIGHT },

  // Monthly Tasks
  { title: 'Mentor Exchange', category: TaskCategory.MONTHLY, resetType: ResetType.MONTHLY },
  { title: 'Fortuna Dust Exchange', category: TaskCategory.MONTHLY, resetType: ResetType.MONTHLY },

  // Seasonal Tasks
  { title: 'Season of Daybreak: Daybreak Seal and Cosmetics', description: 'Available until 06/11/2025', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL },
  { title: 'Gauntlet: Onslaught - Challenge Accepted', description: 'Time-limited triumph', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL },
  { title: 'Gauntlet: Onslaught - Iron Fist', description: 'Time-limited triumph', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL },
  { title: 'Shadowshaper - Reigning Champ', description: 'Time-limited triumph', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL },
]

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let created = 0
    let skipped = 0

    for (const task of defaultTasks) {
      try {
        await prisma.taskTemplate.create({
          data: task
        })
        created++
      } catch (error) {
        // Task already exists, skip
        skipped++
      }
    }

    return NextResponse.json({
      message: 'Default tasks seeded successfully',
      created,
      skipped,
      total: defaultTasks.length
    })
  } catch (error) {
    console.error('Error seeding default tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}