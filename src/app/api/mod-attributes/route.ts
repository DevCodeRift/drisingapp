import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM "ModAttribute" ORDER BY name ASC');

    return NextResponse.json({
      attributes: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        minStatBonus: row.minStatBonus,
        maxStatBonus: row.maxStatBonus,
        createdAt: row.createdAt
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
      `INSERT INTO "ModAttribute" (name, description, "minStatBonus", "maxStatBonus")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [body.name, body.description, body.minStatBonus, body.maxStatBonus]
    );

    return NextResponse.json({
      attribute: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        minStatBonus: result.rows[0].minStatBonus,
        maxStatBonus: result.rows[0].maxStatBonus,
        createdAt: result.rows[0].createdAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating mod attribute:', error);
    return NextResponse.json({ error: 'Failed to create mod attribute' }, { status: 500 });
  }
}
