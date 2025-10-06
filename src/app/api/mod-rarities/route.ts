import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM mod_rarities ORDER BY main_attribute_count ASC, random_attribute_count ASC');

    return NextResponse.json({
      rarities: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        mainAttributeCount: row.main_attribute_count,
        randomAttributeCount: row.random_attribute_count,
        colorCode: row.color_code
      }))
    });
  } catch (error) {
    console.error('Error fetching mod rarities:', error);
    return NextResponse.json({ error: 'Failed to fetch mod rarities' }, { status: 500 });
  }
}
