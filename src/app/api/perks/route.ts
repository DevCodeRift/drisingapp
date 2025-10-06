import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slot = searchParams.get('slot'); // Filter by slot number

    let query = 'SELECT * FROM weapon_perks';
    const params: any[] = [];

    if (slot) {
      query += ' WHERE slot = $1';
      params.push(Number(slot));
    }

    query += ' ORDER BY slot ASC, name ASC';

    const result = await db.query(query, params);

    return NextResponse.json({
      perks: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        slot: row.slot,
        description: row.description,
        effect: row.effect,
        iconUrl: row.icon_url,
        basePower: row.base_power,
        activePerkUpgradePower: row.active_perk_upgrade_power,
        activeExtraFoundryEffectPower: row.active_extra_foundry_effect_power,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching perks:', error);
    return NextResponse.json({ error: 'Failed to fetch perks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await db.query(
      `INSERT INTO weapon_perks (name, slot, description, effect, icon_url, base_power, active_perk_upgrade_power, active_extra_foundry_effect_power)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        body.name,
        body.slot,
        body.description,
        body.effect,
        body.iconUrl,
        body.basePower || 0,
        body.activePerkUpgradePower || 0,
        body.activeExtraFoundryEffectPower || 0
      ]
    );

    return NextResponse.json({
      perk: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        slot: result.rows[0].slot,
        description: result.rows[0].description,
        effect: result.rows[0].effect,
        iconUrl: result.rows[0].icon_url,
        basePower: result.rows[0].base_power,
        activePerkUpgradePower: result.rows[0].active_perk_upgrade_power,
        activeExtraFoundryEffectPower: result.rows[0].active_extra_foundry_effect_power,
        createdAt: result.rows[0].created_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating perk:', error);
    return NextResponse.json({ error: 'Failed to create perk' }, { status: 500 });
  }
}
