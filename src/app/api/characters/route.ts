import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/characters - Fetch all characters
export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}

// POST /api/characters - Create a new character (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check here
    // For now, any authenticated user can create characters

    const body = await req.json();
    const { name, description, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Character name is required' },
        { status: 400 }
      );
    }

    const character = await prisma.character.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    );
  }
}
