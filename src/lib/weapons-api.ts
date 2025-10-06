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

    let sql = `SELECT * FROM "Weapon" WHERE 1=1`;

    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      sql += ` AND "weaponType" = $${paramIndex++}`;
      params.push(type);
    }

    if (element) {
      sql += ` AND "element" = $${paramIndex++}`;
      params.push(element);
    }

    if (slot) {
      sql += ` AND "slot" = $${paramIndex++}`;
      params.push(slot);
    }

    sql += ` ORDER BY "createdAt" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;

    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const result = await db.query(sql, params);

    // Get total count
    const countResult = await db.query(
      'SELECT COUNT(*) FROM "Weapon" WHERE 1=1' +
      (type ? ` AND "weaponType" = $1` : '') +
      (element ? ` AND "element" = $${type ? 2 : 1}` : '') +
      (slot ? ` AND "slot" = $${[type, element].filter(Boolean).length + 1}` : ''),
      [type, element, slot].filter(Boolean)
    );

    res.json({
      data: result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug || generateSimpleSlug(row.name), // Generate slug if missing
        rarity: row.rarity,
        weaponType: row.weaponType,
        basePower: row.basePower,
        combatStyle: row.combatStyle,
        element: row.element,
        slot: row.slot,
        imageUrl: row.imageUrl,
        dps: row.dps,
        precisionBonus: row.precisionBonus,
        magazineCap: row.magazineCap,
        rateOfFire: row.rateOfFire,
        maxAmmo: row.maxAmmo,
        damage: row.damage,
        reloadSpeed: row.reloadSpeed,
        stability: row.stability,
        handling: row.handling,
        range: row.range,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      })),
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

    // Simple query to get single weapon by ID
    const sql = `SELECT * FROM "Weapon" WHERE id = $1`;
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Weapon not found' });
    }

    // Map the result to the expected format
    const row = result.rows[0];
    const weapon = {
      id: row.id,
      name: row.name,
      slug: row.slug || generateSlug(row.name), // Generate slug if missing
      rarity: row.rarity,
      weaponType: row.weaponType,
      basePower: row.basePower,
      combatStyle: row.combatStyle,
      element: row.element,
      slot: row.slot,
      imageUrl: row.imageUrl,
      dps: row.dps,
      precisionBonus: row.precisionBonus,
      magazineCap: row.magazineCap,
      rateOfFire: row.rateOfFire,
      maxAmmo: row.maxAmmo,
      damage: row.damage,
      reloadSpeed: row.reloadSpeed,
      stability: row.stability,
      handling: row.handling,
      range: row.range,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      // Empty arrays for now - we can add these back later
      mods: [],
      compatibleCharacters: [],
      perks: []
    };

    res.json(weapon);
  } catch (error) {
    console.error('Error fetching weapon:', error);
    res.status(500).json({ error: 'Failed to fetch weapon' });
  }
}

// GET /api/weapons/slug/:slug - Get weapon by slug
export async function getWeaponBySlug(req: Request, res: Response, db: DatabaseClient) {
  try {
    const { slug } = req.params;

    // First try to find by slug
    let sql = `SELECT * FROM "Weapon" WHERE slug = $1`;
    let result = await db.query(sql, [slug]);

    // If not found by slug, try to find weapons and match by generated slug
    if (result.rows.length === 0) {
      sql = `SELECT * FROM "Weapon"`;
      const allWeapons = await db.query(sql, []);

      // Find weapon where generated slug matches
      const matchingWeapon = allWeapons.rows.find((row: any) =>
        generateSimpleSlug(row.name) === slug
      );

      if (matchingWeapon) {
        result = { rows: [matchingWeapon] };
      } else {
        return res.status(404).json({ error: 'Weapon not found' });
      }
    }

    // Map the result to the expected format (same as getWeaponById)
    const row = result.rows[0];
    const weapon = {
      id: row.id,
      name: row.name,
      slug: row.slug || generateSlug(row.name), // Generate slug if missing
      rarity: row.rarity,
      weaponType: row.weaponType,
      basePower: row.basePower,
      combatStyle: row.combatStyle,
      element: row.element,
      slot: row.slot,
      imageUrl: row.imageUrl,
      dps: row.dps,
      precisionBonus: row.precisionBonus,
      magazineCap: row.magazineCap,
      rateOfFire: row.rateOfFire,
      maxAmmo: row.maxAmmo,
      damage: row.damage,
      reloadSpeed: row.reloadSpeed,
      stability: row.stability,
      handling: row.handling,
      range: row.range,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      // Empty arrays for now - we can add these back later
      mods: [],
      compatibleCharacters: [],
      perks: []
    };

    res.json(weapon);
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

function generateSlug(name: string, weaponType?: string): string {
  const nameSlug = name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');

  if (weaponType) {
    const weaponTypeSlug = weaponType.toLowerCase().replace(/\s+/g, '-');
    return `${weaponTypeSlug}--${nameSlug}`;
  }

  return nameSlug;
}

function generateSimpleSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
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
