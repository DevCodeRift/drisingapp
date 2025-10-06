-- Weapons Database Schema for Lightbearer.app

-- Main weapons table
CREATE TABLE weapons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    rarity INTEGER NOT NULL CHECK (rarity >= 1 AND rarity <= 5),
    weapon_type VARCHAR(100) NOT NULL,
    base_power_min INTEGER NOT NULL,
    base_power_max INTEGER NOT NULL,
    combat_style VARCHAR(50) NOT NULL,
    element VARCHAR(50) NOT NULL,
    weapon_slot VARCHAR(50) NOT NULL,
    image_url TEXT,
    thumbnail_url TEXT,

    -- Stats
    dps INTEGER,
    precision_bonus DECIMAL(3,2),
    magazine_capacity INTEGER,
    rate_of_fire INTEGER,
    damage INTEGER,
    reload_speed INTEGER,
    stability INTEGER,
    handling INTEGER,
    range INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weapon mods table
CREATE TABLE weapon_mods (
    id SERIAL PRIMARY KEY,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    effect TEXT NOT NULL,
    stat_value DECIMAL(5,2),
    stat_type VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Characters table
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100),
    rarity INTEGER CHECK (rarity >= 1 AND rarity <= 5),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weapon-character compatibility table
CREATE TABLE weapon_character_compatibility (
    id SERIAL PRIMARY KEY,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(weapon_id, character_id)
);

-- Perks table
CREATE TABLE perks (
    id SERIAL PRIMARY KEY,
    weapon_id INTEGER NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
    perk_name VARCHAR(255) NOT NULL,
    perk_description TEXT,
    perk_type VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_weapons_slug ON weapons(slug);
CREATE INDEX idx_weapons_type ON weapons(weapon_type);
CREATE INDEX idx_weapons_element ON weapons(element);
CREATE INDEX idx_weapon_mods_weapon_id ON weapon_mods(weapon_id);
CREATE INDEX idx_weapon_mods_category ON weapon_mods(category);
CREATE INDEX idx_weapon_character_weapon_id ON weapon_character_compatibility(weapon_id);
CREATE INDEX idx_weapon_character_character_id ON weapon_character_compatibility(character_id);
CREATE INDEX idx_perks_weapon_id ON perks(weapon_id);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_weapons_updated_at BEFORE UPDATE ON weapons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
