#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Helper function to convert filename to readable name
function filenameToName(filename) {
  return filename
    .replace('.webp', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to create slug from name
function createSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
}

// Get random values for provisional data
function getRandomRarity() {
  const rarities = [3, 4, 5, 6]; // 3=Rare, 4=Legendary, 5=Mythic, 6=Exotic
  return rarities[Math.floor(Math.random() * rarities.length)];
}

function getRandomElement() {
  const elements = ['Arc', 'Solar', 'Void'];
  return elements[Math.floor(Math.random() * elements.length)];
}

function getRandomCombatStyle() {
  const styles = ['Rapid-Fire', 'Impact', 'Piercing', 'Spread'];
  return styles[Math.floor(Math.random() * styles.length)];
}

function getRandomSlot() {
  const slots = ['Primary', 'Power'];
  return slots[Math.floor(Math.random() * slots.length)];
}

function getRandomBasePower() {
  return Math.floor(Math.random() * 500) + 1000; // 1000-1500 range
}

// Weapon type mapping
const weaponTypeMapping = {
  'autocrossbow': 'Auto Crossbow',
  'autorifles': 'Auto Rifle',
  'fusionrifles': 'Fusion Rifle',
  'grenadelaunchers': 'Grenade Launcher',
  'handcannons': 'Hand Cannon',
  'lightgrenadelaunchers': 'Light Grenade Launcher',
  'linearfusionrifles': 'Linear Fusion Rifle',
  'machineguns': 'Machine Gun',
  'pulserifles': 'Pulse Rifle',
  'rocketlaunchers': 'Rocket Launcher',
  'scoutrifles': 'Scout Rifle',
  'shotguns': 'Shotgun',
  'sidearms': 'Sidearm',
  'sniperrifles': 'Sniper Rifle',
  'submachineguns': 'Submachine Gun',
  'swords': 'Sword'
};

async function scanWeaponImages() {
  const weaponsDir = '/home/tcullen/drisingapp/public/images/weapons';
  const weapons = [];

  console.log('Scanning weapon images...');

  try {
    const weaponTypes = fs.readdirSync(weaponsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const weaponType of weaponTypes) {
      const typeDir = path.join(weaponsDir, weaponType);
      const files = fs.readdirSync(typeDir);

      const webpFiles = files.filter(file => file.endsWith('.webp'));

      console.log(`Found ${webpFiles.length} weapons in ${weaponType}`);

      for (const file of webpFiles) {
        const weaponName = filenameToName(file);
        const slug = createSlug(weaponName);
        const rarity = getRandomRarity();

        const weapon = {
          name: weaponName,
          slug: slug,
          rarity: rarity,
          weaponType: weaponTypeMapping[weaponType] || weaponType,
          basePower: getRandomBasePower(),
          combatStyle: getRandomCombatStyle(),
          element: getRandomElement(),
          slot: getRandomSlot(),
          imageUrl: `/images/weapons/${weaponType}/${file}`,

          // Provisional null stats - to be filled in later
          dps: null,
          precisionBonus: null,
          magazineCap: null,
          rateOfFire: null,
          maxAmmo: null,
          damage: null,
          reloadSpeed: null,
          stability: null,
          handling: null,
          range: null
        };

        weapons.push(weapon);
      }
    }

    console.log(`\\nTotal weapons found: ${weapons.length}`);

    // Generate SQL insert statements
    const sqlStatements = [];

    for (const weapon of weapons) {
      const sql = `INSERT INTO "Weapon" (id, name, slug, rarity, "weaponType", "basePower", "combatStyle", element, slot, "imageUrl", "createdAt", "updatedAt") VALUES (
  '${generateCuid()}',
  '${weapon.name.replace(/'/g, "''")}',
  '${weapon.slug}',
  ${weapon.rarity},
  '${weapon.weaponType}',
  ${weapon.basePower},
  '${weapon.combatStyle}',
  '${weapon.element}',
  '${weapon.slot}',
  '${weapon.imageUrl}',
  NOW(),
  NOW()
);`;
      sqlStatements.push(sql);
    }

    // Write SQL file
    const sqlContent = `-- Provisional weapons data generated from image files
-- Generated on ${new Date().toISOString()}

${sqlStatements.join('\\n\\n')}`;

    fs.writeFileSync('/home/tcullen/drisingapp/weapons_seed.sql', sqlContent);

    // Write JSON file for reference
    fs.writeFileSync('/home/tcullen/drisingapp/weapons_data.json', JSON.stringify(weapons, null, 2));

    console.log('\\nGenerated files:');
    console.log('- weapons_seed.sql (SQL insert statements)');
    console.log('- weapons_data.json (JSON data for reference)');

    // Summary by weapon type
    console.log('\\nWeapons by type:');
    const typeCounts = {};
    weapons.forEach(weapon => {
      typeCounts[weapon.weaponType] = (typeCounts[weapon.weaponType] || 0) + 1;
    });

    Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });

  } catch (error) {
    console.error('Error scanning weapon images:', error);
    process.exit(1);
  }
}

// Simple CUID generator (basic version)
function generateCuid() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `cl${timestamp}${randomStr}`;
}

// Run the script
scanWeaponImages();