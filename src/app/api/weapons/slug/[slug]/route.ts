import { NextRequest, NextResponse } from 'next/server';
import { getWeaponBySlug } from '@/lib/weapons-api';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const req = {
      params: { slug },
      query: {}
    } as any;

    let responseData: any;
    let statusCode = 200;

    const res = {
      json: (data: any) => {
        responseData = data;
        return res;
      },
      status: (code: number) => {
        statusCode = code;
        return res;
      }
    } as any;

    await getWeaponBySlug(req, res, db);

    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    console.error('Error in GET /api/weapons/slug/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}