import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const catalysts = await prisma.catalyst.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ catalysts });
  } catch (error) {
    console.error('Error fetching catalysts:', error);
    return NextResponse.json({ error: 'Failed to fetch catalysts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const catalyst = await prisma.catalyst.create({
      data: {
        name: body.name,
        description: body.description,
        effect: body.effect,
        requirementDescription: body.requirementDescription,
        iconUrl: body.iconUrl
      }
    });

    return NextResponse.json({ catalyst }, { status: 201 });
  } catch (error) {
    console.error('Error creating catalyst:', error);
    return NextResponse.json({ error: 'Failed to create catalyst' }, { status: 500 });
  }
}
