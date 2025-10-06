import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/lfg - Fetch LFG posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const active = searchParams.get('active') !== 'false'; // Default to active only

    const lfgPosts = await prisma.lFGPost.findMany({
      where: active ? { active: true } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(lfgPosts);
  } catch (error) {
    console.error('Error fetching LFG posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LFG posts' },
      { status: 500 }
    );
  }
}

// POST /api/lfg - Create a new LFG post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { activity, description, playerCount, region, expiresInMinutes } = body;

    if (!activity || !description || !playerCount) {
      return NextResponse.json(
        { error: 'Activity, description, and player count are required' },
        { status: 400 }
      );
    }

    // Calculate expiration date
    const expiresAt = expiresInMinutes
      ? new Date(Date.now() + expiresInMinutes * 60 * 1000)
      : null;

    const lfgPost = await prisma.lFGPost.create({
      data: {
        activity,
        description,
        playerCount: parseInt(playerCount),
        region,
        expiresAt,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(lfgPost);
  } catch (error) {
    console.error('Error creating LFG post:', error);
    return NextResponse.json(
      { error: 'Failed to create LFG post' },
      { status: 500 }
    );
  }
}

// PATCH /api/lfg - Update LFG post (mark as inactive)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, active } = body;

    // Verify ownership
    const lfgPost = await prisma.lFGPost.findUnique({
      where: { id },
    });

    if (!lfgPost || lfgPost.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const updated = await prisma.lFGPost.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating LFG post:', error);
    return NextResponse.json(
      { error: 'Failed to update LFG post' },
      { status: 500 }
    );
  }
}
