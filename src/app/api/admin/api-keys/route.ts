import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth-admin';
import { randomBytes } from 'crypto';

/**
 * GET /api/admin/api-keys
 * List all API keys (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const adminStatus = await isAdmin();

    if (!adminStatus) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(apiKeys, { status: 200 });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/api-keys
 * Create a new API key (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const adminStatus = await isAdmin();

    if (!adminStatus) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate a secure random API key
    const apiKey = `lb_${randomBytes(32).toString('hex')}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        key: apiKey,
        name,
        isActive: true,
      },
    });

    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/api-keys
 * Update an API key (toggle active status)
 */
export async function PATCH(request: NextRequest) {
  try {
    const adminStatus = await isAdmin();

    if (!adminStatus) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'ID and isActive (boolean) are required' },
        { status: 400 }
      );
    }

    const updatedApiKey = await prisma.apiKey.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updatedApiKey, { status: 200 });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/api-keys
 * Delete an API key
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminStatus = await isAdmin();

    if (!adminStatus) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
