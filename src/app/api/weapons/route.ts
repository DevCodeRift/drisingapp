import { NextRequest, NextResponse } from 'next/server';
import { getAllWeapons, createWeapon } from '@/lib/weapons-api';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Create a mock Express-like req/res for the weapons-api functions
    const req = {
      query: Object.fromEntries(request.nextUrl.searchParams)
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

    await getAllWeapons(req, res, db);

    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    console.error('Error in GET /api/weapons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const req = {
      body,
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

    await createWeapon(req, res, db);

    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    console.error('Error in POST /api/weapons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
