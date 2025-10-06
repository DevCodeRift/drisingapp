// Extended TypeScript types for Traits, Perks, Catalysts, and Enhanced Mods

// ============================================================================
// TRAITS
// ============================================================================
export interface Trait {
  id: string;
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
  id: string;
  name: string;
  slot: number; // 1-4
  description?: string;
  effect?: string;
  iconUrl?: string;

  // Power Combination
  basePower?: number;
  activePerkUpgradePower?: number;
  activeExtraFoundryEffectPower?: number;

  createdAt: Date;
}

export interface WeaponPerkFormData {
  name: string;
  slot: number;
  description?: string;
  effect?: string;
  iconUrl?: string;

  // Power Combination
  basePower?: number;
  activePerkUpgradePower?: number;
  activeExtraFoundryEffectPower?: number;
}

// ============================================================================
// CATALYSTS
// ============================================================================
export interface Catalyst {
  id: string;
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
  id: string;
  weaponId: string;
  traitId: string;
  slot: number; // 1 = Intrinsic, 2 = Origin
  trait?: Trait;
  createdAt: Date;
}

export interface WeaponPerkAssignment {
  id: string;
  weaponId: string;
  perkId: string;
  slot: number; // 3 = Perk 1, 4 = Perk 2
  perk?: WeaponPerk;
  createdAt: Date;
}

export interface WeaponCatalyst {
  id: string;
  weaponId: string;
  catalystId: string;
  catalyst?: Catalyst;
  createdAt: Date;
}

// ============================================================================
// ENHANCED MODS SYSTEM
// ============================================================================
export interface ModRarity {
  id: string;
  name: 'Rare' | 'Legendary' | 'Mythic' | 'Exotic';
  mainAttributeCount: number;
  randomAttributeCount: number;
  colorCode?: string;
}

export interface ModAttribute {
  id: string;
  name: string;
  description?: string;
  statBonus?: string;
  createdAt: Date;
}

export interface WeaponMod {
  id: string;
  name: string;
  category: 'Ammo' | 'Scope' | 'Magazine';
  rarityId?: string;
  rarity?: ModRarity;
  description?: string;
  combatStyle?: string;
  unlocksPerkUpgrade: boolean;
  perkUpgradeDescription?: string;
  iconUrl?: string;

  // Mod Power (Refinement Power + Enhance Perk)
  refinementPowerMin?: number; // At refinement level 1
  refinementPowerMax?: number; // At refinement level 10
  enhancePerkPower?: number;

  // Stat Boost Range
  statBoostMin?: number; // e.g., 1.4%
  statBoostMax?: number; // e.g., 14%
  statBoostType?: string; // e.g., "body shot dmg"

  // Refinement Levels
  refinementLevelMin?: number; // Default 1
  refinementLevelMax?: number; // Default 10

  createdAt: Date;

  // Relations
  mainAttributes?: ModAttribute[];
  randomAttributes?: ModAttribute[];
  upgradablePerks?: WeaponPerk[];
}

export interface WeaponModFormData {
  name: string;
  category: 'Ammo' | 'Scope' | 'Magazine';
  rarityId?: string;
  description?: string;
  combatStyle?: string;
  unlocksPerkUpgrade: boolean;
  perkUpgradeDescription?: string;
  iconUrl?: string;

  // Mod Power
  refinementPowerMin?: number;
  refinementPowerMax?: number;
  enhancePerkPower?: number;

  // Stat Boost Range
  statBoostMin?: number;
  statBoostMax?: number;
  statBoostType?: string;

  // Refinement Levels
  refinementLevelMin?: number;
  refinementLevelMax?: number;

  mainAttributeIds: string[];
  randomAttributeIds: string[];
  upgradablePerkIds: string[];
  perkUpgradeDescriptions: { [perkId: string]: string };
}

export interface ModAttributeFormData {
  name: string;
  description?: string;
  statBonus?: string;
}

export interface WeaponModAssignment {
  id: string;
  weaponId: string;
  modId: string;
  slotCategory: 'Ammo' | 'Scope' | 'Magazine';
  displayOrder: number;
  mod?: WeaponMod;
  createdAt: Date;
}

// ============================================================================
// UPDATED WEAPON TYPE WITH NEW FIELDS
// ============================================================================
export interface WeaponWithExtendedData {
  id: string;
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
  intrinsicTraitId?: string;
  originTraitId?: string;

  // Perk selections (Slot 3 & 4)
  perk1Id?: string;
  perk2Id?: string;

  // Catalyst selection (if rarity >= 6)
  catalystId?: string;

  // Mod selections
  ammoModIds: string[];
  scopeModIds: string[];
  magazineModIds: string[];
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
