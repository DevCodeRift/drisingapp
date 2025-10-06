import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/builds - Fetch builds with optional character filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get('characterId');
    const sortBy = searchParams.get('sortBy') || 'upvotes'; // 'upvotes' or 'recent'

    const where = characterId ? { characterId } : {};

    const builds = await prisma.build.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        character: true,
        votes: true,
      },
      orderBy: sortBy === 'recent'
        ? { createdAt: 'desc' }
        : { voteCount: 'desc' },
    });

    return NextResponse.json(builds);
  } catch (error) {
    console.error('Error fetching builds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}

// POST /api/builds - Create a new build
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, characterId, content } = body;

    if (!title || !description || !characterId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const build = await prisma.build.create({
      data: {
        title,
        description,
        characterId,
        content,
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
        character: true,
      },
    });

    return NextResponse.json(build);
  } catch (error) {
    console.error('Error creating build:', error);
    return NextResponse.json(
      { error: 'Failed to create build' },
      { status: 500 }
    );
  }
}
