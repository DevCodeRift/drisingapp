import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/news - Fetch news posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'ARTICLE', 'VIDEO', 'GUIDE', 'OTHER'
    const sortBy = searchParams.get('sortBy') || 'upvotes'; // 'upvotes' or 'recent'

    const where = type ? { type: type as any } : {};

    const news = await prisma.news.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        upvotes: true,
      },
      orderBy: sortBy === 'recent'
        ? { createdAt: 'desc' }
        : { upvoteCount: 'desc' },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST /api/news - Create a new news post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, type, url } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newsPost = await prisma.news.create({
      data: {
        title,
        content,
        type: type || 'ARTICLE',
        url,
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

    return NextResponse.json(newsPost);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news post' },
      { status: 500 }
    );
  }
}
