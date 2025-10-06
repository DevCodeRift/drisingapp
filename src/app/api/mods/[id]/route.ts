import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.query('DELETE FROM weapon_mods WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Mod deleted successfully' });
  } catch (error) {
    console.error('Error deleting mod:', error);
    return NextResponse.json({ error: 'Failed to delete mod' }, { status: 500 });
  }
}
