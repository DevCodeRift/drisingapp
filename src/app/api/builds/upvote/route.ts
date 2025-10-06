import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/builds/upvote - Vote on a build (upvote or downvote)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { buildId, value } = body; // value: 1 for upvote, -1 for downvote

    if (!buildId || !value) {
      return NextResponse.json(
        { error: 'Missing buildId or value' },
        { status: 400 }
      );
    }

    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: 'Invalid vote value. Must be 1 or -1' },
        { status: 400 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_buildId: {
          userId: session.user.id,
          buildId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if clicking same button
        await prisma.$transaction([
          prisma.vote.delete({
            where: { id: existingVote.id },
          }),
          prisma.build.update({
            where: { id: buildId },
            data: { voteCount: { decrement: value } },
          }),
        ]);

        return NextResponse.json({ voted: null });
      } else {
        // Change vote (e.g., from upvote to downvote)
        await prisma.$transaction([
          prisma.vote.update({
            where: { id: existingVote.id },
            data: { value },
          }),
          prisma.build.update({
            where: { id: buildId },
            data: { voteCount: { increment: value * 2 } }, // Change by 2 (remove old, add new)
          }),
        ]);

        return NextResponse.json({ voted: value });
      }
    } else {
      // Add new vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId: session.user.id,
            buildId,
            value,
          },
        }),
        prisma.build.update({
          where: { id: buildId },
          data: { voteCount: { increment: value } },
        }),
      ]);

      return NextResponse.json({ voted: value });
    }
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    );
  }
}
