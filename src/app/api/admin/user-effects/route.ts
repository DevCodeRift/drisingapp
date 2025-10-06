import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/admin/user-effects - Set special effects for user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check

    const body = await req.json();
    const { userId, nameEffect, customColor } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get or create profile
    let profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          userId,
          nameEffect,
          customColor,
        },
      });
    } else {
      profile = await prisma.userProfile.update({
        where: { userId },
        data: {
          nameEffect,
          customColor,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error setting user effects:', error);
    return NextResponse.json(
      { error: 'Failed to set user effects' },
      { status: 500 }
    );
  }
}
