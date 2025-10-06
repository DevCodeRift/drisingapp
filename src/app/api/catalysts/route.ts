import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM catalysts ORDER BY name ASC');

    return NextResponse.json({
      catalysts: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        effect: row.effect,
        requirementDescription: row.requirement_description,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching catalysts:', error);
    return NextResponse.json({ error: 'Failed to fetch catalysts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await db.query(
      `INSERT INTO catalysts (name, description, effect, requirement_description, icon_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [body.name, body.description, body.effect, body.requirementDescription, body.iconUrl]
    );

    return NextResponse.json({
      catalyst: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        effect: result.rows[0].effect,
        requirementDescription: result.rows[0].requirement_description,
        iconUrl: result.rows[0].icon_url,
        createdAt: result.rows[0].created_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating catalyst:', error);
    return NextResponse.json({ error: 'Failed to create catalyst' }, { status: 500 });
  }
}
