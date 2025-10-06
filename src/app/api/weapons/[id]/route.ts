import { NextRequest, NextResponse } from 'next/server';
import { getWeaponById, updateWeapon, deleteWeapon } from '@/lib/weapons-api';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const req = {
      params,
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

    await getWeaponById(req, res, db);

    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    console.error('Error in GET /api/weapons/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const req = {
      params,
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

    await updateWeapon(req, res, db);

    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    console.error('Error in PUT /api/weapons/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const req = {
      params,
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

    await deleteWeapon(req, res, db);

    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    console.error('Error in DELETE /api/weapons/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
