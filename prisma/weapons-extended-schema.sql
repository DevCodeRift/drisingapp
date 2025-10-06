-- Extended Weapons Database Schema for Traits, Perks, Catalysts, and Enhanced Mods

-- ============================================================================
-- TRAITS TABLE
-- ============================================================================
CREATE TABLE traits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'intrinsic' or 'origin'
    description TEXT,
    effect TEXT, -- e.g., "+800 power to the weapon"
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_traits_type ON traits(type);

-- ============================================================================
-- PERKS TABLE
-- ============================================================================
CREATE TABLE weapon_perks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slot INTEGER NOT NULL CHECK (slot >= 1 AND slot <= 4), -- Perk slot 1-4
    description TEXT,
    effect TEXT, -- e.g., "+30% rate of fire and damage for lower half of magazine"
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weapon_perks_slot ON weapon_perks(slot);

-- ============================================================================
-- CATALYSTS TABLE (For Exotic/6-star weapons)
-- ============================================================================
CREATE TABLE catalysts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    effect TEXT,
    requirement_description TEXT, -- How to unlock/obtain
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- WEAPON-TRAIT ASSIGNMENTS
-- ============================================================================
CREATE TABLE weapon_traits (
    id SERIAL PRIMARY KEY,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    trait_id INTEGER NOT NULL REFERENCES traits(id) ON DELETE CASCADE,
    slot INTEGER NOT NULL CHECK (slot >= 1 AND slot <= 2), -- Slot 1: Intrinsic, Slot 2: Origin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(weapon_id, slot)
);

CREATE INDEX idx_weapon_traits_weapon_id ON weapon_traits(weapon_id);
CREATE INDEX idx_weapon_traits_trait_id ON weapon_traits(trait_id);

-- ============================================================================
-- WEAPON-PERK ASSIGNMENTS
-- ============================================================================
CREATE TABLE weapon_perk_assignments (
    id SERIAL PRIMARY KEY,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    perk_id INTEGER NOT NULL REFERENCES weapon_perks(id) ON DELETE CASCADE,
    slot INTEGER NOT NULL CHECK (slot >= 3 AND slot <= 4), -- Slot 3: Perk 1, Slot 4: Perk 2
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(weapon_id, slot)
);

CREATE INDEX idx_weapon_perk_assignments_weapon_id ON weapon_perk_assignments(weapon_id);
CREATE INDEX idx_weapon_perk_assignments_perk_id ON weapon_perk_assignments(perk_id);

-- ============================================================================
-- WEAPON-CATALYST ASSIGNMENTS
-- ============================================================================
CREATE TABLE weapon_catalysts (
    id SERIAL PRIMARY KEY,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    catalyst_id INTEGER NOT NULL REFERENCES catalysts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(weapon_id, catalyst_id)
);

CREATE INDEX idx_weapon_catalysts_weapon_id ON weapon_catalysts(weapon_id);

-- ============================================================================
-- ENHANCED MODS SYSTEM
-- ============================================================================

-- Mod Rarities and Attributes
CREATE TABLE mod_rarities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- 'Exotic', 'Mythic', 'Legendary', 'Rare'
    main_attribute_count INTEGER NOT NULL DEFAULT 1,
    random_attribute_count INTEGER NOT NULL DEFAULT 0,
    color_code VARCHAR(7) -- Hex color for UI
);

-- Insert default rarities
INSERT INTO mod_rarities (name, main_attribute_count, random_attribute_count, color_code) VALUES
('Rare', 1, 1, '#3b82f6'),
('Legendary', 1, 2, '#a855f7'),
('Mythic', 1, 2, '#f59e0b'),
('Exotic', 1, 2, '#ef4444');

-- Mod Attributes (stat bonuses)
CREATE TABLE mod_attributes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stat_bonus TEXT, -- e.g., "+10% damage", "+5% reload speed"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Weapon Mods (updated from original weapon_mods)
DROP TABLE IF EXISTS weapon_mods CASCADE;

CREATE TABLE weapon_mods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Ammo', 'Scope', 'Magazine'
    rarity_id INTEGER REFERENCES mod_rarities(id),
    description TEXT,

    -- Combat style compatibility
    combat_style VARCHAR(50), -- 'rapid-fire', 'impact', 'piercing', 'spread', or NULL for all

    -- Perk upgrades
    unlocks_perk_upgrade BOOLEAN DEFAULT FALSE,
    perk_upgrade_description TEXT,

    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weapon_mods_category ON weapon_mods(category);
CREATE INDEX idx_weapon_mods_rarity ON weapon_mods(rarity_id);
CREATE INDEX idx_weapon_mods_combat_style ON weapon_mods(combat_style);

-- Mod-Attribute Assignments (Main Attributes)
CREATE TABLE mod_main_attributes (
    id SERIAL PRIMARY KEY,
    mod_id INTEGER NOT NULL REFERENCES weapon_mods(id) ON DELETE CASCADE,
    attribute_id INTEGER NOT NULL REFERENCES mod_attributes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mod_main_attributes_mod_id ON mod_main_attributes(mod_id);

-- Mod-Attribute Assignments (Random Attribute Pool)
CREATE TABLE mod_random_attributes (
    id SERIAL PRIMARY KEY,
    mod_id INTEGER NOT NULL REFERENCES weapon_mods(id) ON DELETE CASCADE,
    attribute_id INTEGER NOT NULL REFERENCES mod_attributes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mod_random_attributes_mod_id ON mod_random_attributes(mod_id);

-- Perks that a mod can upgrade
CREATE TABLE mod_perk_upgrades (
    id SERIAL PRIMARY KEY,
    mod_id INTEGER NOT NULL REFERENCES weapon_mods(id) ON DELETE CASCADE,
    perk_id INTEGER NOT NULL REFERENCES weapon_perks(id) ON DELETE CASCADE,
    upgrade_description TEXT, -- What the upgrade does
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mod_perk_upgrades_mod_id ON mod_perk_upgrades(mod_id);
CREATE INDEX idx_mod_perk_upgrades_perk_id ON mod_perk_upgrades(perk_id);

-- Weapon-Mod Assignments (updated)
CREATE TABLE weapon_mod_assignments (
    id SERIAL PRIMARY KEY,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    mod_id INTEGER NOT NULL REFERENCES weapon_mods(id) ON DELETE CASCADE,
    slot_category VARCHAR(50) NOT NULL, -- 'Ammo', 'Scope', 'Magazine'
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weapon_mod_assignments_weapon_id ON weapon_mod_assignments(weapon_id);
CREATE INDEX idx_weapon_mod_assignments_mod_id ON weapon_mod_assignments(mod_id);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Sample Traits
INSERT INTO traits (name, type, description, effect) VALUES
('Aggressive Frame', 'intrinsic', 'High damage, high recoil', '+800 power to the weapon'),
('Lightweight Frame', 'intrinsic', 'Fast movement, quick handling', '+15% movement speed while equipped'),
('Precision Frame', 'intrinsic', 'Recoil pattern is more predictable', '+20% precision damage'),
('Vanguard''s Might', 'origin', 'Increased power against combatants', '+10% damage vs PvE enemies'),
('Crucible Legend', 'origin', 'Enhanced performance in PvP', '+5% damage and handling in Crucible');

-- Sample Perks
INSERT INTO weapon_perks (name, slot, description, effect) VALUES
('Rampage', 3, 'Kills increase damage', 'Stacking damage buff up to 3x'),
('Kill Clip', 3, 'Reloading after kill grants damage boost', '+33% damage for 5 seconds'),
('Outlaw', 4, 'Precision kills greatly increase reload speed', '+100% reload speed'),
('Feeding Frenzy', 4, 'Each kill increases reload speed', 'Stacking reload speed buff'),
('Firefly', 3, 'Precision kills create explosions', 'AoE explosion on precision kill'),
('Dragonfly', 4, 'Precision kills create elemental explosions', 'Elemental explosion damage');

-- Sample Catalysts
INSERT INTO catalysts (name, description, effect, requirement_description) VALUES
('Enhanced Damage', 'Significantly increases weapon damage', '+25% base damage', 'Complete 500 kills with this weapon'),
('Master Reload', 'Dramatically improves reload speed', '+50% reload speed', 'Complete weapon-specific quest'),
('Precision Master', 'Increases precision damage and stability', '+30% precision damage, +20 stability', 'Earn 200 precision kills');

-- Sample Mod Attributes
INSERT INTO mod_attributes (name, description, stat_bonus) VALUES
('Damage Boost', 'Increases weapon damage', '+5% damage'),
('Reload Enhancement', 'Faster reload speed', '+10% reload speed'),
('Stability Increase', 'Better weapon stability', '+15 stability'),
('Range Extension', 'Increased effective range', '+20 range'),
('Precision Bonus', 'Better precision damage', '+8% precision damage'),
('Rate of Fire', 'Faster firing rate', '+5% rate of fire'),
('Magazine Size', 'More rounds in magazine', '+2 magazine capacity'),
('Handling Boost', 'Better weapon handling', '+15 handling');
