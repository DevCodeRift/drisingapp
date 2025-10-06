import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/admin/seed-characters - Bulk import characters with images
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check here
    // For now, any authenticated user can seed characters

    const characters = [
      { name: 'Attal', imageUrl: '/characters/Attal.png' },
      { name: 'Estela', imageUrl: '/characters/Estela.png' },
      { name: 'Finnala', imageUrl: '/characters/Finnala.png' },
      { name: 'Gwynn', imageUrl: '/characters/Gwynn.png' },
      { name: 'Ikora', imageUrl: '/characters/Ikora.png' },
      { name: 'Jolder', imageUrl: '/characters/Jolder.png' },
      { name: 'Kabr', imageUrl: '/characters/Kabr.png' },
      { name: 'Ning Fei', imageUrl: '/characters/Ning_Fei.png' },
      { name: 'Tan-2', imageUrl: '/characters/Tan-2.png' },
      { name: 'Umeko', imageUrl: '/characters/Umeko.png' },
      { name: 'Wolf', imageUrl: '/characters/Wolf.png' },
      { name: 'Xuan-Wei', imageUrl: '/characters/Xuan-Wei.png' },
    ];

    const results = [];
    const errors = [];

    for (const char of characters) {
      try {
        // Check if character already exists
        const existing = await prisma.character.findFirst({
          where: { name: char.name }
        });

        if (existing) {
          errors.push(`${char.name} already exists`);
          continue;
        }

        const created = await prisma.character.create({
          data: char,
        });

        results.push(created);
      } catch (error) {
        console.error(`Error creating character ${char.name}:`, error);
        errors.push(`Failed to create ${char.name}`);
      }
    }

    return NextResponse.json({
      success: true,
      created: results.length,
      skipped: errors.length,
      characters: results,
      errors,
    });
  } catch (error) {
    console.error('Error seeding characters:', error);
    return NextResponse.json(
      { error: 'Failed to seed characters' },
      { status: 500 }
    );
  }
}
