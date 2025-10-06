import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slot = searchParams.get('slot'); // Filter by slot number

    const perks = await prisma.perk.findMany({
      where: slot ? { slot: Number(slot) } : undefined,
      orderBy: [{ slot: 'asc' }, { name: 'asc' }]
    });

    return NextResponse.json({ perks });
  } catch (error) {
    console.error('Error fetching perks:', error);
    return NextResponse.json({ error: 'Failed to fetch perks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const perk = await prisma.perk.create({
      data: {
        name: body.name,
        slot: body.slot,
        description: body.description,
        effect: body.effect,
        iconUrl: body.iconUrl
      }
    });

    return NextResponse.json({ perk }, { status: 201 });
  } catch (error) {
    console.error('Error creating perk:', error);
    return NextResponse.json({ error: 'Failed to create perk' }, { status: 500 });
  }
}
