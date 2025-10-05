import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/clans - Fetch clan recruitment posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const active = searchParams.get('active') !== 'false'; // Default to active only

    const clanPosts = await prisma.clanRecruitment.findMany({
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

    return NextResponse.json(clanPosts);
  } catch (error) {
    console.error('Error fetching clan posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clan recruitment posts' },
      { status: 500 }
    );
  }
}

// POST /api/clans - Create a new clan recruitment post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { clanName, description, requirements, contactInfo } = body;

    if (!clanName || !description || !contactInfo) {
      return NextResponse.json(
        { error: 'Clan name, description, and contact info are required' },
        { status: 400 }
      );
    }

    const clanPost = await prisma.clanRecruitment.create({
      data: {
        clanName,
        description,
        requirements,
        contactInfo,
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

    return NextResponse.json(clanPost);
  } catch (error) {
    console.error('Error creating clan post:', error);
    return NextResponse.json(
      { error: 'Failed to create clan recruitment post' },
      { status: 500 }
    );
  }
}

// PATCH /api/clans - Update clan post (mark as inactive)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, active } = body;

    // Verify ownership
    const clanPost = await prisma.clanRecruitment.findUnique({
      where: { id },
    });

    if (!clanPost || clanPost.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const updated = await prisma.clanRecruitment.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating clan post:', error);
    return NextResponse.json(
      { error: 'Failed to update clan recruitment post' },
      { status: 500 }
    );
  }
}
