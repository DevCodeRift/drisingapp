import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TaskCategory, ResetType } from '@/types/tasks'

const taskTemplates = [
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
  { title: 'Season of Daybreak: Daybreak Seal and Cosmetics', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL, description: 'Available until 06/11/2025' },
  { title: 'Gauntlet: Onslaught - Challenge Accepted', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL, description: 'Time-limited triumph' },
  { title: 'Gauntlet: Onslaught - Iron Fist', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL, description: 'Time-limited triumph' },
  { title: 'Shadowshaper - Reigning Champ', category: TaskCategory.SEASONAL, resetType: ResetType.SEASONAL, description: 'Time-limited triumph' },
]

export async function POST() {
  try {
    // Clear existing task templates
    await prisma.taskTemplate.deleteMany()

    // Create new task templates
    for (const template of taskTemplates) {
      await prisma.taskTemplate.create({
        data: template
      })
    }

    return NextResponse.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}