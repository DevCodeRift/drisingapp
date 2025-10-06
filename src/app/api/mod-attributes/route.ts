import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const attributes = await prisma.modAttribute.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ attributes });
  } catch (error) {
    console.error('Error fetching mod attributes:', error);
    return NextResponse.json({ error: 'Failed to fetch mod attributes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const attribute = await prisma.modAttribute.create({
      data: {
        name: body.name,
        description: body.description,
        minStatBonus: body.minStatBonus,
        maxStatBonus: body.maxStatBonus
      }
    });

    return NextResponse.json({ attribute }, { status: 201 });
  } catch (error) {
    console.error('Error creating mod attribute:', error);
    return NextResponse.json({ error: 'Failed to create mod attribute' }, { status: 500 });
  }
}
