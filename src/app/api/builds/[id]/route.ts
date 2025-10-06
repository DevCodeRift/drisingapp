import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const build = await prisma.build.findUnique({
      where: { id },
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
        artifacts: {
          include: {
            attributes: true
          },
          orderBy: {
            slot: 'asc'
          }
        },
        weapons: {
          include: {
            weapon: true,
            traits: true,
            perks: true,
            catalysts: true,
            mods: true
          }
        }
      },
    });

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(build);
  } catch (error) {
    console.error('Error fetching build:', error);
    return NextResponse.json(
      { error: 'Failed to fetch build' },
      { status: 500 }
    );
  }
}
