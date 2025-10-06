import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Helper function to convert filename to readable name
function filenameToName(filename: string): string {
  return filename
    .replace('.webp', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to create slug from name
function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
}

// Get random values for provisional data
function getRandomRarity(): number {
  const rarities = [3, 4, 5, 6]; // 3=Rare, 4=Legendary, 5=Mythic, 6=Exotic
  return rarities[Math.floor(Math.random() * rarities.length)];
}

function getRandomElement(): string {
  const elements = ['Arc', 'Solar', 'Void'];
  return elements[Math.floor(Math.random() * elements.length)];
}

function getRandomCombatStyle(): string {
  const styles = ['Rapid-Fire', 'Impact', 'Piercing', 'Spread'];
  return styles[Math.floor(Math.random() * styles.length)];
}

function getRandomSlot(): string {
  const slots = ['Primary', 'Power'];
  return slots[Math.floor(Math.random() * slots.length)];
}

function getRandomBasePower(): number {
  return Math.floor(Math.random() * 500) + 1000; // 1000-1500 range
}

// Weapon type mapping
const weaponTypeMapping: Record<string, string> = {
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

export async function POST(request: NextRequest) {
  try {
    console.log('Starting weapon seeding...');

    // Check if weapons already exist
    const existingWeapons = await prisma.weapon.count();
    if (existingWeapons > 0) {
      return NextResponse.json({
        error: 'Weapons already exist in database',
        count: existingWeapons
      }, { status: 400 });
    }

    const weaponsDir = path.join(process.cwd(), 'public/images/weapons');
    const weapons = [];

    // Read weapon types (directories)
    const weaponTypes = fs.readdirSync(weaponsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const weaponType of weaponTypes) {
      const typeDir = path.join(weaponsDir, weaponType);
      const files = fs.readdirSync(typeDir);
      const webpFiles = files.filter(file => file.endsWith('.webp'));

      console.log(`Processing ${webpFiles.length} weapons in ${weaponType}`);

      for (const file of webpFiles) {
        const weaponName = filenameToName(file);
        const slug = createSlug(weaponName);

        // Check for duplicate slugs
        let finalSlug = slug;
        let counter = 1;
        while (weapons.some(w => w.slug === finalSlug)) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }

        const weapon = {
          name: weaponName,
          slug: finalSlug,
          rarity: getRandomRarity(),
          weaponType: weaponTypeMapping[weaponType] || weaponType,
          basePower: getRandomBasePower(),
          combatStyle: getRandomCombatStyle(),
          element: getRandomElement(),
          slot: getRandomSlot(),
          imageUrl: `/images/weapons/${weaponType}/${file}`,
        };

        weapons.push(weapon);
      }
    }

    console.log(`Creating ${weapons.length} weapons in database...`);

    // Create weapons in database
    const createdWeapons = [];
    for (const weapon of weapons) {
      const created = await prisma.weapon.create({
        data: weapon
      });
      createdWeapons.push(created);
    }

    console.log('Weapon seeding completed successfully!');

    // Generate summary
    const typeCounts: Record<string, number> = {};
    createdWeapons.forEach(weapon => {
      typeCounts[weapon.weaponType] = (typeCounts[weapon.weaponType] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdWeapons.length} weapons`,
      weaponCounts: typeCounts,
      totalWeapons: createdWeapons.length
    });

  } catch (error) {
    console.error('Error seeding weapons:', error);
    return NextResponse.json({
      error: 'Failed to seed weapons',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const weaponCount = await prisma.weapon.count();
    const weapons = await prisma.weapon.findMany({
      select: {
        id: true,
        name: true,
        weaponType: true,
        rarity: true,
        element: true,
        createdAt: true
      },
      take: 10 // Just first 10 for preview
    });

    return NextResponse.json({
      totalWeapons: weaponCount,
      sampleWeapons: weapons
    });
  } catch (error) {
    console.error('Error fetching weapons:', error);
    return NextResponse.json({
      error: 'Failed to fetch weapons',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}