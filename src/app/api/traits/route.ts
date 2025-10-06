import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type'); // 'intrinsic' or 'origin'

    const traits = await prisma.trait.findMany({
      where: type ? { type } : undefined,
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ traits });
  } catch (error) {
    console.error('Error fetching traits:', error);
    return NextResponse.json({ error: 'Failed to fetch traits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const trait = await prisma.trait.create({
      data: {
        name: body.name,
        type: body.type,
        description: body.description,
        effect: body.effect,
        iconUrl: body.iconUrl
      }
    });

    return NextResponse.json({ trait }, { status: 201 });
  } catch (error) {
    console.error('Error creating trait:', error);
    return NextResponse.json({ error: 'Failed to create trait' }, { status: 500 });
  }
}
