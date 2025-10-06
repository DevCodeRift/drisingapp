import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.query('SELECT * FROM traits WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Trait not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      trait: {
        id: row.id,
        name: row.name,
        type: row.type,
        description: row.description,
        effect: row.effect,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching trait:', error);
    return NextResponse.json({ error: 'Failed to fetch trait' }, { status: 500 });
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
      `UPDATE traits
       SET name = $1, type = $2, description = $3, effect = $4, icon_url = $5
       WHERE id = $6
       RETURNING *`,
      [body.name, body.type, body.description, body.effect, body.iconUrl, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Trait not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      trait: {
        id: row.id,
        name: row.name,
        type: row.type,
        description: row.description,
        effect: row.effect,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('Error updating trait:', error);
    return NextResponse.json({ error: 'Failed to update trait' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.query('DELETE FROM traits WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Trait deleted successfully' });
  } catch (error) {
    console.error('Error deleting trait:', error);
    return NextResponse.json({ error: 'Failed to delete trait' }, { status: 500 });
  }
}
