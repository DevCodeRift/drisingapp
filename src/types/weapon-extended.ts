// Extended TypeScript types for Traits, Perks, Catalysts, and Enhanced Mods

// ============================================================================
// TRAITS
// ============================================================================
export interface Trait {
  id: number;
  name: string;
  type: 'intrinsic' | 'origin';
  description?: string;
  effect?: string;
  iconUrl?: string;
  createdAt: Date;
}

export interface TraitFormData {
  name: string;
  type: 'intrinsic' | 'origin';
  description?: string;
  effect?: string;
  iconUrl?: string;
}

// ============================================================================
// PERKS
// ============================================================================
export interface WeaponPerk {
  id: number;
  name: string;
  slot: number; // 1-4
  description?: string;
  effect?: string;
  iconUrl?: string;
  createdAt: Date;
}

export interface WeaponPerkFormData {
  name: string;
  slot: number;
  description?: string;
  effect?: string;
  iconUrl?: string;
}

// ============================================================================
// CATALYSTS
// ============================================================================
export interface Catalyst {
  id: number;
  name: string;
  description?: string;
  effect?: string;
  requirementDescription?: string;
  iconUrl?: string;
  createdAt: Date;
}

export interface CatalystFormData {
  name: string;
  description?: string;
  effect?: string;
  requirementDescription?: string;
  iconUrl?: string;
}

// ============================================================================
// WEAPON ASSIGNMENTS
// ============================================================================
export interface WeaponTrait {
  id: number;
  weaponId: number;
  traitId: number;
  slot: number; // 1 = Intrinsic, 2 = Origin
  trait?: Trait;
  createdAt: Date;
}

export interface WeaponPerkAssignment {
  id: number;
  weaponId: number;
  perkId: number;
  slot: number; // 3 = Perk 1, 4 = Perk 2
  perk?: WeaponPerk;
  createdAt: Date;
}

export interface WeaponCatalyst {
  id: number;
  weaponId: number;
  catalystId: number;
  catalyst?: Catalyst;
  createdAt: Date;
}

// ============================================================================
// ENHANCED MODS SYSTEM
// ============================================================================
export interface ModRarity {
  id: number;
  name: 'Rare' | 'Legendary' | 'Mythic' | 'Exotic';
  mainAttributeCount: number;
  randomAttributeCount: number;
  colorCode?: string;
}

export interface ModAttribute {
  id: number;
  name: string;
  description?: string;
  statBonus?: string;
  createdAt: Date;
}

export interface WeaponMod {
  id: number;
  name: string;
  category: 'Ammo' | 'Scope' | 'Magazine';
  rarityId?: number;
  rarity?: ModRarity;
  description?: string;
  combatStyle?: string;
  unlocksPerkUpgrade: boolean;
  perkUpgradeDescription?: string;
  iconUrl?: string;
  createdAt: Date;

  // Relations
  mainAttributes?: ModAttribute[];
  randomAttributes?: ModAttribute[];
  upgradablePerks?: WeaponPerk[];
}

export interface WeaponModFormData {
  name: string;
  category: 'Ammo' | 'Scope' | 'Magazine';
  rarityId?: number;
  description?: string;
  combatStyle?: string;
  unlocksPerkUpgrade: boolean;
  perkUpgradeDescription?: string;
  iconUrl?: string;

  mainAttributeIds: number[];
  randomAttributeIds: number[];
  upgradablePerkIds: number[];
  perkUpgradeDescriptions: { [perkId: number]: string };
}

export interface ModAttributeFormData {
  name: string;
  description?: string;
  statBonus?: string;
}

export interface WeaponModAssignment {
  id: number;
  weaponId: number;
  modId: number;
  slotCategory: 'Ammo' | 'Scope' | 'Magazine';
  displayOrder: number;
  mod?: WeaponMod;
  createdAt: Date;
}

// ============================================================================
// UPDATED WEAPON TYPE WITH NEW FIELDS
// ============================================================================
export interface WeaponWithExtendedData {
  id: number;
  name: string;
  slug: string;
  rarity: number;

  // Traits (Slot 1 & 2)
  intrinsicTrait?: Trait;
  originTrait?: Trait;

  // Perks (Slot 3 & 4)
  perk1?: WeaponPerk;
  perk2?: WeaponPerk;

  // Catalyst (6-star/Exotic only)
  catalyst?: Catalyst;

  // Mods
  ammoMods?: WeaponMod[];
  scopeMods?: WeaponMod[];
  magazineMods?: WeaponMod[];
}

// Form data for weapon creation/editing with new fields
export interface ExtendedWeaponFormData {
  // Basic fields
  name: string;
  rarity: number;
  weaponType: string;
  // ... other basic fields

  // Trait selections (Slot 1 & 2)
  intrinsicTraitId?: number;
  originTraitId?: number;

  // Perk selections (Slot 3 & 4)
  perk1Id?: number;
  perk2Id?: number;

  // Catalyst selection (if rarity >= 6)
  catalystId?: number;

  // Mod selections
  ammoModIds: number[];
  scopeModIds: number[];
  magazineModIds: number[];
}

// Constants
export const TRAIT_TYPES = ['intrinsic', 'origin'] as const;
export const PERK_SLOTS = [1, 2, 3, 4] as const;
export const MOD_RARITIES = ['Rare', 'Legendary', 'Mythic', 'Exotic'] as const;
export const COMBAT_STYLES_EXTENDED = ['rapid-fire', 'impact', 'piercing', 'spread'] as const;

export type TraitType = typeof TRAIT_TYPES[number];
export type PerkSlot = typeof PERK_SLOTS[number];
export type ModRarityType = typeof MOD_RARITIES[number];
export type CombatStyleExtended = typeof COMBAT_STYLES_EXTENDED[number];
