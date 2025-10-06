import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const combatStyle = searchParams.get('combatStyle');

    let query = `
      SELECT
        wm.*,
        mr.name as rarity_name,
        mr.main_attribute_count,
        mr.random_attribute_count,
        mr.color_code,
        json_agg(DISTINCT jsonb_build_object(
          'id', ma_main.id,
          'name', ma_main.name,
          'statBonus', ma_main.stat_bonus
        )) FILTER (WHERE ma_main.id IS NOT NULL) as main_attributes,
        json_agg(DISTINCT jsonb_build_object(
          'id', ma_random.id,
          'name', ma_random.name,
          'statBonus', ma_random.stat_bonus
        )) FILTER (WHERE ma_random.id IS NOT NULL) as random_attributes,
        json_agg(DISTINCT jsonb_build_object(
          'id', wp.id,
          'name', wp.name,
          'upgradeDescription', mpu.upgrade_description
        )) FILTER (WHERE wp.id IS NOT NULL) as upgradable_perks
      FROM weapon_mods wm
      LEFT JOIN mod_rarities mr ON wm.rarity_id = mr.id
      LEFT JOIN mod_main_attributes mma ON wm.id = mma.mod_id
      LEFT JOIN mod_attributes ma_main ON mma.attribute_id = ma_main.id
      LEFT JOIN mod_random_attributes mra ON wm.id = mra.mod_id
      LEFT JOIN mod_attributes ma_random ON mra.attribute_id = ma_random.id
      LEFT JOIN mod_perk_upgrades mpu ON wm.id = mpu.mod_id
      LEFT JOIN weapon_perks wp ON mpu.perk_id = wp.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND wm.category = $${paramIndex++}`;
      params.push(category);
    }

    if (combatStyle) {
      query += ` AND (wm.combat_style = $${paramIndex++} OR wm.combat_style IS NULL)`;
      params.push(combatStyle);
    }

    query += ` GROUP BY wm.id, mr.id ORDER BY wm.name ASC`;

    const result = await db.query(query, params);

    return NextResponse.json({
      mods: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        rarityId: row.rarity_id,
        rarity: row.rarity_name ? {
          name: row.rarity_name,
          mainAttributeCount: row.main_attribute_count,
          randomAttributeCount: row.random_attribute_count,
          colorCode: row.color_code
        } : null,
        description: row.description,
        combatStyle: row.combat_style,
        unlocksPerkUpgrade: row.unlocks_perk_upgrade,
        perkUpgradeDescription: row.perk_upgrade_description,
        iconUrl: row.icon_url,
        mainAttributes: row.main_attributes || [],
        randomAttributes: row.random_attributes || [],
        upgradablePerks: row.upgradable_perks || [],
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching mods:', error);
    return NextResponse.json({ error: 'Failed to fetch mods' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await db.transaction(async (client) => {
      // Insert mod
      const modResult = await client.query(
        `INSERT INTO weapon_mods (name, category, rarity_id, description, combat_style, unlocks_perk_upgrade, perk_upgrade_description, icon_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          body.name,
          body.category,
          body.rarityId || null,
          body.description,
          body.combatStyle || null,
          body.unlocksPerkUpgrade || false,
          body.perkUpgradeDescription,
          body.iconUrl
        ]
      );

      const modId = modResult.rows[0].id;

      // Insert main attributes
      if (body.mainAttributeIds && body.mainAttributeIds.length > 0) {
        for (const attrId of body.mainAttributeIds) {
          await client.query(
            `INSERT INTO mod_main_attributes (mod_id, attribute_id) VALUES ($1, $2)`,
            [modId, attrId]
          );
        }
      }

      // Insert random attributes pool
      if (body.randomAttributeIds && body.randomAttributeIds.length > 0) {
        for (const attrId of body.randomAttributeIds) {
          await client.query(
            `INSERT INTO mod_random_attributes (mod_id, attribute_id) VALUES ($1, $2)`,
            [modId, attrId]
          );
        }
      }

      // Insert perk upgrades
      if (body.upgradablePerkIds && body.upgradablePerkIds.length > 0) {
        for (const perkId of body.upgradablePerkIds) {
          await client.query(
            `INSERT INTO mod_perk_upgrades (mod_id, perk_id, upgrade_description)
             VALUES ($1, $2, $3)`,
            [modId, perkId, body.perkUpgradeDescriptions?.[perkId] || '']
          );
        }
      }
    });

    return NextResponse.json({ message: 'Mod created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating mod:', error);
    return NextResponse.json({ error: 'Failed to create mod' }, { status: 500 });
  }
}
