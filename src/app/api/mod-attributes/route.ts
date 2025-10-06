import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM mod_attributes ORDER BY name ASC');

    return NextResponse.json({
      attributes: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        statBonus: row.stat_bonus,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching mod attributes:', error);
    return NextResponse.json({ error: 'Failed to fetch mod attributes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await db.query(
      `INSERT INTO mod_attributes (name, description, stat_bonus)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [body.name, body.description, body.statBonus]
    );

    return NextResponse.json({
      attribute: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        statBonus: result.rows[0].stat_bonus,
        createdAt: result.rows[0].created_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating mod attribute:', error);
    return NextResponse.json({ error: 'Failed to create mod attribute' }, { status: 500 });
  }
}
