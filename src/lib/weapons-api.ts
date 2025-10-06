// API Routes for Weapon CRUD Operations
// This file contains Express.js/Next.js API route handlers for managing weapons

// Generic request/response types
interface Request {
  params?: any;
  query?: any;
  body?: any;
}

interface Response {
  json: (data: any) => Response;
  status: (code: number) => Response;
}
import { WeaponFormData, Weapon } from '@/types/weapons';

// Database interface - implement with your database client (PostgreSQL, Prisma, etc.)
interface DatabaseClient {
  query: (sql: string, params: any[]) => Promise<any>;
  transaction: (callback: (client: DatabaseClient) => Promise<void>) => Promise<void>;
}

// GET /api/weapons - Get all weapons
export async function getAllWeapons(req: Request, res: Response, db: DatabaseClient) {
  try {
    const { type, element, slot, page = 1, limit = 20 } = req.query;

    let sql = `
      SELECT
        w.*,
        json_agg(DISTINCT jsonb_build_object(
          'id', wm.id,
          'category', wm.category,
          'name', wm.name,
          'effect', wm.effect,
          'statValue', wm.stat_value,
          'statType', wm.stat_type,
          'displayOrder', wm.display_order
        )) FILTER (WHERE wm.id IS NOT NULL) as mods,
        json_agg(DISTINCT jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'role', c.role,
          'rarity', c.rarity,
          'imageUrl', c.image_url
        )) FILTER (WHERE c.id IS NOT NULL) as compatible_characters,
        json_agg(DISTINCT jsonb_build_object(
          'id', p.id,
          'perkName', p.perk_name,
          'perkDescription', p.perk_description,
          'perkType', p.perk_type,
          'displayOrder', p.display_order
        )) FILTER (WHERE p.id IS NOT NULL) as perks
      FROM weapons w
      LEFT JOIN weapon_mods wm ON w.id = wm.weapon_id
      LEFT JOIN weapon_character_compatibility wcc ON w.id = wcc.weapon_id
      LEFT JOIN characters c ON wcc.character_id = c.id
      LEFT JOIN perks p ON w.id = p.weapon_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      sql += ` AND w.weapon_type = $${paramIndex++}`;
      params.push(type);
    }

    if (element) {
      sql += ` AND w.element = $${paramIndex++}`;
      params.push(element);
    }

    if (slot) {
      sql += ` AND w.weapon_slot = $${paramIndex++}`;
      params.push(slot);
    }

    sql += `
      GROUP BY w.id
      ORDER BY w.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;

    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const result = await db.query(sql, params);

    // Get total count
    const countResult = await db.query(
      'SELECT COUNT(*) FROM weapons WHERE 1=1' +
      (type ? ` AND weapon_type = $1` : '') +
      (element ? ` AND element = $${type ? 2 : 1}` : '') +
      (slot ? ` AND weapon_slot = $${[type, element].filter(Boolean).length + 1}` : ''),
      [type, element, slot].filter(Boolean)
    );

    res.json({
      data: result.rows.map(mapDatabaseToWeapon),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching weapons:', error);
    res.status(500).json({ error: 'Failed to fetch weapons' });
  }
}

// GET /api/weapons/:id - Get single weapon by ID
export async function getWeaponById(req: Request, res: Response, db: DatabaseClient) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT
        w.*,
        json_agg(DISTINCT jsonb_build_object(
          'id', wm.id,
          'category', wm.category,
          'name', wm.name,
          'effect', wm.effect,
          'statValue', wm.stat_value,
          'statType', wm.stat_type,
          'displayOrder', wm.display_order
        )) FILTER (WHERE wm.id IS NOT NULL) as mods,
        json_agg(DISTINCT jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'role', c.role,
          'rarity', c.rarity,
          'imageUrl', c.image_url
        )) FILTER (WHERE c.id IS NOT NULL) as compatible_characters,
        json_agg(DISTINCT jsonb_build_object(
          'id', p.id,
          'perkName', p.perk_name,
          'perkDescription', p.perk_description,
          'perkType', p.perk_type,
          'displayOrder', p.display_order
        )) FILTER (WHERE p.id IS NOT NULL) as perks
      FROM weapons w
      LEFT JOIN weapon_mods wm ON w.id = wm.weapon_id
      LEFT JOIN weapon_character_compatibility wcc ON w.id = wcc.weapon_id
      LEFT JOIN characters c ON wcc.character_id = c.id
      LEFT JOIN perks p ON w.id = p.weapon_id
      WHERE w.id = $1
      GROUP BY w.id
    `;

    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Weapon not found' });
    }

    res.json(mapDatabaseToWeapon(result.rows[0]));
  } catch (error) {
    console.error('Error fetching weapon:', error);
    res.status(500).json({ error: 'Failed to fetch weapon' });
  }
}

// GET /api/weapons/slug/:slug - Get weapon by slug
export async function getWeaponBySlug(req: Request, res: Response, db: DatabaseClient) {
  try {
    const { slug } = req.params;

    const sql = `
      SELECT
        w.*,
        json_agg(DISTINCT jsonb_build_object(
          'id', wm.id,
          'category', wm.category,
          'name', wm.name,
          'effect', wm.effect,
          'statValue', wm.stat_value,
          'statType', wm.stat_type,
          'displayOrder', wm.display_order
        )) FILTER (WHERE wm.id IS NOT NULL) as mods,
        json_agg(DISTINCT jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'role', c.role,
          'rarity', c.rarity,
          'imageUrl', c.image_url
        )) FILTER (WHERE c.id IS NOT NULL) as compatible_characters,
        json_agg(DISTINCT jsonb_build_object(
          'id', p.id,
          'perkName', p.perk_name,
          'perkDescription', p.perk_description,
          'perkType', p.perk_type,
          'displayOrder', p.display_order
        )) FILTER (WHERE p.id IS NOT NULL) as perks
      FROM weapons w
      LEFT JOIN weapon_mods wm ON w.id = wm.weapon_id
      LEFT JOIN weapon_character_compatibility wcc ON w.id = wcc.weapon_id
      LEFT JOIN characters c ON wcc.character_id = c.id
      LEFT JOIN perks p ON w.id = p.weapon_id
      WHERE w.slug = $1
      GROUP BY w.id
    `;

    const result = await db.query(sql, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Weapon not found' });
    }

    res.json(mapDatabaseToWeapon(result.rows[0]));
  } catch (error) {
    console.error('Error fetching weapon:', error);
    res.status(500).json({ error: 'Failed to fetch weapon' });
  }
}

// POST /api/weapons - Create new weapon
export async function createWeapon(req: Request, res: Response, db: DatabaseClient) {
  try {
    const formData: WeaponFormData = req.body;

    // Generate slug from name
    const slug = generateSlug(formData.name, formData.weaponType);

    await db.transaction(async (trx) => {
      // Insert weapon
      const weaponResult = await trx.query(
        `INSERT INTO weapons (
          name, slug, rarity, weapon_type, base_power,
          combat_style, element, slot, image_url,
          dps, precision_bonus, magazine_cap, rate_of_fire, max_ammo, damage,
          reload_speed, stability, handling, range
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING id`,
        [
          formData.name, slug, formData.rarity, formData.weaponType,
          formData.basePower, formData.combatStyle,
          formData.element, formData.slot, formData.imageUrl,
          formData.dps, formData.precisionBonus, formData.magazineCap,
          formData.rateOfFire, formData.maxAmmo, formData.damage, formData.reloadSpeed,
          formData.stability, formData.handling, formData.range
        ]
      );

      const weaponId = weaponResult.rows[0].id;

      // Insert mods
      if (formData.mods && formData.mods.length > 0) {
        for (const mod of formData.mods) {
          await trx.query(
            `INSERT INTO weapon_mods (
              weapon_id, category, name, effect, stat_value, stat_type, display_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [weaponId, mod.category, mod.name, mod.effect, mod.statValue, mod.statType, mod.displayOrder || 0]
          );
        }
      }

      // Insert character compatibility
      if (formData.compatibleCharacterIds && formData.compatibleCharacterIds.length > 0) {
        for (const characterId of formData.compatibleCharacterIds) {
          await trx.query(
            `INSERT INTO weapon_character_compatibility (weapon_id, character_id) VALUES ($1, $2)`,
            [weaponId, characterId]
          );
        }
      }

      // Insert perks
      if (formData.perks && formData.perks.length > 0) {
        for (const perk of formData.perks) {
          await trx.query(
            `INSERT INTO perks (
              weapon_id, perk_name, perk_description, perk_type, display_order
            ) VALUES ($1, $2, $3, $4, $5)`,
            [weaponId, perk.perkName, perk.perkDescription, perk.perkType, perk.displayOrder || 0]
          );
        }
      }

      // Insert traits (intrinsic and origin)
      if (formData.intrinsicTraitId) {
        await trx.query(
          `INSERT INTO weapon_traits (weapon_id, trait_id, slot) VALUES ($1, $2, $3)`,
          [weaponId, formData.intrinsicTraitId, 1]
        );
      }

      if (formData.originTraitId) {
        await trx.query(
          `INSERT INTO weapon_traits (weapon_id, trait_id, slot) VALUES ($1, $2, $3)`,
          [weaponId, formData.originTraitId, 2]
        );
      }

      // Insert perk assignments (slots 3 and 4)
      if (formData.perk1Id) {
        await trx.query(
          `INSERT INTO weapon_perk_assignments (weapon_id, perk_id, slot) VALUES ($1, $2, $3)`,
          [weaponId, formData.perk1Id, 3]
        );
      }

      if (formData.perk2Id) {
        await trx.query(
          `INSERT INTO weapon_perk_assignments (weapon_id, perk_id, slot) VALUES ($1, $2, $3)`,
          [weaponId, formData.perk2Id, 4]
        );
      }

      // Insert catalyst (only for exotic/6-star weapons)
      if (formData.catalystId && formData.rarity >= 6) {
        await trx.query(
          `INSERT INTO weapon_catalysts (weapon_id, catalyst_id) VALUES ($1, $2)`,
          [weaponId, formData.catalystId]
        );
      }
    });

    res.status(201).json({ message: 'Weapon created successfully', slug });
  } catch (error) {
    console.error('Error creating weapon:', error);
    res.status(500).json({ error: 'Failed to create weapon' });
  }
}

// PUT /api/weapons/:id - Update weapon
export async function updateWeapon(req: Request, res: Response, db: DatabaseClient) {
  try {
    const { id } = req.params;
    const formData: WeaponFormData = req.body;

    // Generate slug from name
    const slug = generateSlug(formData.name, formData.weaponType);

    await db.transaction(async (trx) => {
      // Update weapon
      await trx.query(
        `UPDATE weapons SET
          name = $1, slug = $2, rarity = $3, weapon_type = $4,
          base_power_min = $5, base_power_max = $6, combat_style = $7,
          element = $8, weapon_slot = $9, image_url = $10, thumbnail_url = $11,
          dps = $12, precision_bonus = $13, magazine_capacity = $14,
          rate_of_fire = $15, damage = $16, reload_speed = $17,
          stability = $18, handling = $19, range = $20
        WHERE id = $21`,
        [
          formData.name, slug, formData.rarity, formData.weaponType,
          formData.basePower, formData.combatStyle,
          formData.element, formData.slot, formData.imageUrl,
          formData.dps, formData.precisionBonus, formData.magazineCap,
          formData.rateOfFire, formData.maxAmmo, formData.damage, formData.reloadSpeed,
          formData.stability, formData.handling, formData.range, id
        ]
      );

      // Delete existing mods, characters, perks, traits, perk assignments, and catalysts
      await trx.query('DELETE FROM weapon_mods WHERE weapon_id = $1', [id]);
      await trx.query('DELETE FROM weapon_character_compatibility WHERE weapon_id = $1', [id]);
      await trx.query('DELETE FROM perks WHERE weapon_id = $1', [id]);
      await trx.query('DELETE FROM weapon_traits WHERE weapon_id = $1', [id]);
      await trx.query('DELETE FROM weapon_perk_assignments WHERE weapon_id = $1', [id]);
      await trx.query('DELETE FROM weapon_catalysts WHERE weapon_id = $1', [id]);

      // Re-insert mods
      if (formData.mods && formData.mods.length > 0) {
        for (const mod of formData.mods) {
          await trx.query(
            `INSERT INTO weapon_mods (
              weapon_id, category, name, effect, stat_value, stat_type, display_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, mod.category, mod.name, mod.effect, mod.statValue, mod.statType, mod.displayOrder || 0]
          );
        }
      }

      // Re-insert character compatibility
      if (formData.compatibleCharacterIds && formData.compatibleCharacterIds.length > 0) {
        for (const characterId of formData.compatibleCharacterIds) {
          await trx.query(
            `INSERT INTO weapon_character_compatibility (weapon_id, character_id) VALUES ($1, $2)`,
            [id, characterId]
          );
        }
      }

      // Re-insert perks
      if (formData.perks && formData.perks.length > 0) {
        for (const perk of formData.perks) {
          await trx.query(
            `INSERT INTO perks (
              weapon_id, perk_name, perk_description, perk_type, display_order
            ) VALUES ($1, $2, $3, $4, $5)`,
            [id, perk.perkName, perk.perkDescription, perk.perkType, perk.displayOrder || 0]
          );
        }
      }

      // Re-insert traits (intrinsic and origin)
      if (formData.intrinsicTraitId) {
        await trx.query(
          `INSERT INTO weapon_traits (weapon_id, trait_id, slot) VALUES ($1, $2, $3)`,
          [id, formData.intrinsicTraitId, 1]
        );
      }

      if (formData.originTraitId) {
        await trx.query(
          `INSERT INTO weapon_traits (weapon_id, trait_id, slot) VALUES ($1, $2, $3)`,
          [id, formData.originTraitId, 2]
        );
      }

      // Re-insert perk assignments (slots 3 and 4)
      if (formData.perk1Id) {
        await trx.query(
          `INSERT INTO weapon_perk_assignments (weapon_id, perk_id, slot) VALUES ($1, $2, $3)`,
          [id, formData.perk1Id, 3]
        );
      }

      if (formData.perk2Id) {
        await trx.query(
          `INSERT INTO weapon_perk_assignments (weapon_id, perk_id, slot) VALUES ($1, $2, $3)`,
          [id, formData.perk2Id, 4]
        );
      }

      // Re-insert catalyst (only for exotic/6-star weapons)
      if (formData.catalystId && formData.rarity >= 6) {
        await trx.query(
          `INSERT INTO weapon_catalysts (weapon_id, catalyst_id) VALUES ($1, $2)`,
          [id, formData.catalystId]
        );
      }
    });

    res.json({ message: 'Weapon updated successfully', slug });
  } catch (error) {
    console.error('Error updating weapon:', error);
    res.status(500).json({ error: 'Failed to update weapon' });
  }
}

// DELETE /api/weapons/:id - Delete weapon
export async function deleteWeapon(req: Request, res: Response, db: DatabaseClient) {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM weapons WHERE id = $1', [id]);

    res.json({ message: 'Weapon deleted successfully' });
  } catch (error) {
    console.error('Error deleting weapon:', error);
    res.status(500).json({ error: 'Failed to delete weapon' });
  }
}

// Helper Functions

function generateSlug(name: string, weaponType: string): string {
  const weaponTypeSlug = weaponType.toLowerCase().replace(/\s+/g, '-');
  const nameSlug = name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return `${weaponTypeSlug}--${nameSlug}`;
}

function mapDatabaseToWeapon(row: any): Weapon {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    rarity: row.rarity,
    weaponType: row.weapon_type,
    basePower: row.base_power,
    combatStyle: row.combat_style,
    element: row.element,
    slot: row.slot,
    imageUrl: row.image_url,
    dps: row.dps,
    precisionBonus: row.precision_bonus,
    magazineCap: row.magazine_cap,
    rateOfFire: row.rate_of_fire,
    maxAmmo: row.max_ammo,
    damage: row.damage,
    reloadSpeed: row.reload_speed,
    stability: row.stability,
    handling: row.handling,
    range: row.range,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    mods: row.mods || [],
    compatibleCharacters: row.compatible_characters || [],
    perks: row.perks || []
  };
}

// Express Router Setup Example
/*
import express from 'express';
const router = express.Router();

router.get('/weapons', (req, res) => getAllWeapons(req, res, db));
router.get('/weapons/:id', (req, res) => getWeaponById(req, res, db));
router.get('/weapons/slug/:slug', (req, res) => getWeaponBySlug(req, res, db));
router.post('/weapons', (req, res) => createWeapon(req, res, db));
router.put('/weapons/:id', (req, res) => updateWeapon(req, res, db));
router.delete('/weapons/:id', (req, res) => deleteWeapon(req, res, db));

export default router;
*/
