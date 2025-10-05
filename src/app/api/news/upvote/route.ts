import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// POST /api/news/upvote - Toggle upvote on a news post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { newsId } = body;

    if (!newsId) {
      return NextResponse.json(
        { error: 'Missing newsId' },
        { status: 400 }
      );
    }

    // Check if user already upvoted
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_newsId: {
          userId: session.user.id,
          newsId,
        },
      },
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.$transaction([
        prisma.upvote.delete({
          where: { id: existingUpvote.id },
        }),
        prisma.news.update({
          where: { id: newsId },
          data: { upvoteCount: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ upvoted: false });
    } else {
      // Add upvote
      await prisma.$transaction([
        prisma.upvote.create({
          data: {
            userId: session.user.id,
            newsId,
          },
        }),
        prisma.news.update({
          where: { id: newsId },
          data: { upvoteCount: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({ upvoted: true });
    }
  } catch (error) {
    console.error('Error toggling upvote:', error);
    return NextResponse.json(
      { error: 'Failed to toggle upvote' },
      { status: 500 }
    );
  }
}
