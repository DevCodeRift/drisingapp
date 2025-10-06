import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.query('SELECT * FROM weapon_perks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Perk not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      perk: {
        id: row.id,
        name: row.name,
        slot: row.slot,
        description: row.description,
        effect: row.effect,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching perk:', error);
    return NextResponse.json({ error: 'Failed to fetch perk' }, { status: 500 });
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
      `UPDATE weapon_perks
       SET name = $1, slot = $2, description = $3, effect = $4, icon_url = $5
       WHERE id = $6
       RETURNING *`,
      [body.name, body.slot, body.description, body.effect, body.iconUrl, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Perk not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      perk: {
        id: row.id,
        name: row.name,
        slot: row.slot,
        description: row.description,
        effect: row.effect,
        iconUrl: row.icon_url,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('Error updating perk:', error);
    return NextResponse.json({ error: 'Failed to update perk' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.query('DELETE FROM weapon_perks WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Perk deleted successfully' });
  } catch (error) {
    console.error('Error deleting perk:', error);
    return NextResponse.json({ error: 'Failed to delete perk' }, { status: 500 });
  }
}
