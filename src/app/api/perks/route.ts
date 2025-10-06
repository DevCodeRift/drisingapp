import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slot = searchParams.get('slot'); // Filter by slot number

    let query = 'SELECT * FROM weapon_perks';
    const params: any[] = [];

    if (slot) {
      query += ' WHERE slot = $1';
      params.push(Number(slot));
    }

    query += ' ORDER BY slot ASC, name ASC';

    const result = await db.query(query, params);

    return NextResponse.json({
      perks: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        slot: row.slot,
        description: row.description,
        effect: row.effect,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching perks:', error);
    return NextResponse.json({ error: 'Failed to fetch perks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await db.query(
      `INSERT INTO weapon_perks (name, slot, description, effect, icon_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [body.name, body.slot, body.description, body.effect, body.iconUrl]
    );

    return NextResponse.json({
      perk: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        slot: result.rows[0].slot,
        description: result.rows[0].description,
        effect: result.rows[0].effect,
        iconUrl: result.rows[0].icon_url,
        createdAt: result.rows[0].created_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating perk:', error);
    return NextResponse.json({ error: 'Failed to create perk' }, { status: 500 });
  }
}
