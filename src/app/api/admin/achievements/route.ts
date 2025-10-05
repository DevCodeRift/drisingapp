import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/admin/achievements - List all achievements
export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST /api/admin/achievements - Create a new achievement
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check

    const body = await req.json();
    const { key, name, description, icon } = body;

    if (!key || !name || !description) {
      return NextResponse.json(
        { error: 'Key, name, and description are required' },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        key,
        name,
        description,
        icon,
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}
