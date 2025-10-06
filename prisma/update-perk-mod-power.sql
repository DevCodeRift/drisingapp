-- Add power fields to weapon_perks table
ALTER TABLE weapon_perks ADD COLUMN IF NOT EXISTS base_power INTEGER DEFAULT 0;
ALTER TABLE weapon_perks ADD COLUMN IF NOT EXISTS active_perk_upgrade_power INTEGER DEFAULT 0;
ALTER TABLE weapon_perks ADD COLUMN IF NOT EXISTS active_extra_foundry_effect_power INTEGER DEFAULT 0;
ALTER TABLE weapon_perks ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add power and refinement fields to weapon_mods table
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS refinement_power_min INTEGER DEFAULT 0;
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS refinement_power_max INTEGER DEFAULT 0;
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS enhance_perk_power INTEGER DEFAULT 0;
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS stat_boost_min DECIMAL(5,2) DEFAULT 0;
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS stat_boost_max DECIMAL(5,2) DEFAULT 0;
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS stat_boost_type VARCHAR(100);
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS refinement_level_min INTEGER DEFAULT 1;
ALTER TABLE weapon_mods ADD COLUMN IF NOT EXISTS refinement_level_max INTEGER DEFAULT 10;

-- Add icon_url to traits and catalysts
ALTER TABLE traits ADD COLUMN IF NOT EXISTS icon_url TEXT;
ALTER TABLE catalysts ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add comments for clarity
COMMENT ON COLUMN weapon_perks.base_power IS 'Base power of the perk';
COMMENT ON COLUMN weapon_perks.active_perk_upgrade_power IS 'Power from active perk upgrade';
COMMENT ON COLUMN weapon_perks.active_extra_foundry_effect_power IS 'Power from active extra foundry effect';

COMMENT ON COLUMN weapon_mods.refinement_power_min IS 'Minimum refinement power at level 1';
COMMENT ON COLUMN weapon_mods.refinement_power_max IS 'Maximum refinement power at level 10';
COMMENT ON COLUMN weapon_mods.enhance_perk_power IS 'Power from enhance perk';
COMMENT ON COLUMN weapon_mods.stat_boost_min IS 'Minimum stat boost percentage at refinement level 1';
COMMENT ON COLUMN weapon_mods.stat_boost_max IS 'Maximum stat boost percentage at refinement level 10';
COMMENT ON COLUMN weapon_mods.stat_boost_type IS 'Type of stat being boosted (e.g., "body shot dmg")';
