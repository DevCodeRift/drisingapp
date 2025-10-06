// TypeScript interfaces for Lightbearer weapons database

export interface Weapon {
  id: number;
  name: string;
  slug: string;
  rarity: number;
  weaponType: string;
  basePowerMin: number;
  basePowerMax: number;
  combatStyle: string;
  element: string;
  weaponSlot: string;
  imageUrl?: string;
  thumbnailUrl?: string;

  // Stats
  dps?: number;
  precisionBonus?: number;
  magazineCapacity?: number;
  rateOfFire?: number;
  damage?: number;
  reloadSpeed?: number;
  stability?: number;
  handling?: number;
  range?: number;

  createdAt: Date;
  updatedAt: Date;

  // Relations
  mods?: WeaponMod[];
  compatibleCharacters?: Character[];
  perks?: Perk[];
}

export interface WeaponMod {
  id: number;
  weaponId: number;
  category: 'Ammo' | 'Scope' | 'Magazine';
  name: string;
  effect: string;
  statValue?: number;
  statType?: string;
  displayOrder: number;
  createdAt: Date;
}

export interface Character {
  id: number;
  name: string;
  role?: string;
  rarity?: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface WeaponCharacterCompatibility {
  id: number;
  weaponId: number;
  characterId: number;
  createdAt: Date;
}

export interface Perk {
  id: number;
  weaponId: number;
  perkName: string;
  perkDescription?: string;
  perkType?: string;
  displayOrder: number;
  createdAt: Date;
}

// Form data types for creating/updating weapons
export interface WeaponFormData {
  name: string;
  rarity: number;
  weaponType: string;
  basePowerMin: number;
  basePowerMax: number;
  combatStyle: string;
  element: string;
  weaponSlot: string;
  imageUrl?: string;
  thumbnailUrl?: string;

  // Stats
  dps?: number;
  precisionBonus?: number;
  magazineCapacity?: number;
  rateOfFire?: number;
  damage?: number;
  reloadSpeed?: number;
  stability?: number;
  handling?: number;
  range?: number;

  // Trait/Perk/Catalyst selections
  intrinsicTraitId?: number;
  originTraitId?: number;
  perk1Id?: number;
  perk2Id?: number;
  catalystId?: number;

  // Nested data
  mods: WeaponModFormData[];
  compatibleCharacterIds: number[];
  perks: PerkFormData[];
}

export interface WeaponModFormData {
  category: 'Ammo' | 'Scope' | 'Magazine';
  name: string;
  effect: string;
  statValue?: number;
  statType?: string;
  displayOrder?: number;
}

export interface PerkFormData {
  perkName: string;
  perkDescription?: string;
  perkType?: string;
  displayOrder?: number;
}

// Enums for dropdown options
export const WEAPON_TYPES = [
  'Hand Cannon',
  'Auto Rifle',
  'Pulse Rifle',
  'Scout Rifle',
  'Sniper Rifle',
  'Shotgun',
  'Fusion Rifle',
  'Linear Fusion Rifle',
  'Submachine Gun',
  'Sidearm',
  'Machine Gun',
  'Rocket Launcher',
  'Grenade Launcher',
  'Light Grenade Launcher',
  'Auto Crossbow',
  'Sword'
] as const;

export const ELEMENTS = [
  'Arc',
  'Solar',
  'Void'
] as const;

export const COMBAT_STYLES = [
  'Piercing',
  'Impact',
  'Spread',
  'Rapid-Fire'
] as const;

export const WEAPON_SLOTS = [
  'Primary',
  'Power'
] as const;

export const MOD_CATEGORIES = [
  'Ammo',
  'Scope',
  'Magazine'
] as const;

export type WeaponType = typeof WEAPON_TYPES[number];
export type Element = typeof ELEMENTS[number];
export type CombatStyle = typeof COMBAT_STYLES[number];
export type WeaponSlot = typeof WEAPON_SLOTS[number];
export type ModCategory = typeof MOD_CATEGORIES[number];
