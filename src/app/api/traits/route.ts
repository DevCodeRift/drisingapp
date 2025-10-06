import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type'); // 'intrinsic' or 'origin'

    let query = 'SELECT * FROM traits';
    const params: any[] = [];

    if (type) {
      query += ' WHERE type = $1';
      params.push(type);
    }

    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);

    return NextResponse.json({
      traits: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        description: row.description,
        effect: row.effect,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching traits:', error);
    return NextResponse.json({ error: 'Failed to fetch traits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await db.query(
      `INSERT INTO traits (name, type, description, effect, icon_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [body.name, body.type, body.description, body.effect, body.iconUrl]
    );

    return NextResponse.json({
      trait: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        type: result.rows[0].type,
        description: result.rows[0].description,
        effect: result.rows[0].effect,
        iconUrl: result.rows[0].icon_url,
        createdAt: result.rows[0].created_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating trait:', error);
    return NextResponse.json({ error: 'Failed to create trait' }, { status: 500 });
  }
}
