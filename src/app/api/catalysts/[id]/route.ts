import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.query('SELECT * FROM catalysts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Catalyst not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      catalyst: {
        id: row.id,
        name: row.name,
        description: row.description,
        effect: row.effect,
        requirementDescription: row.requirement_description,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching catalyst:', error);
    return NextResponse.json({ error: 'Failed to fetch catalyst' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await db.query(
      `UPDATE catalysts
       SET name = $1, description = $2, effect = $3, requirement_description = $4, icon_url = $5
       WHERE id = $6
       RETURNING *`,
      [body.name, body.description, body.effect, body.requirementDescription, body.iconUrl, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Catalyst not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      catalyst: {
        id: row.id,
        name: row.name,
        description: row.description,
        effect: row.effect,
        requirementDescription: row.requirement_description,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('Error updating catalyst:', error);
    return NextResponse.json({ error: 'Failed to update catalyst' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.query('DELETE FROM catalysts WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Catalyst deleted successfully' });
  } catch (error) {
    console.error('Error deleting catalyst:', error);
    return NextResponse.json({ error: 'Failed to delete catalyst' }, { status: 500 });
  }
}
