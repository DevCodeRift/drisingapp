import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.modAttribute.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 500 });
  }
}
