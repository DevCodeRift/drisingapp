// Image asset paths for the Destiny Rising application

export const ASSET_PATHS = {
  // Combat Style / Weapon Type Logos
  combatStyles: {
    'Impact': '/images/misc/impact.png',
    'Piercing': '/images/misc/piercing.png',
    'Rapid-Fire': '/images/misc/rapid-fire.png',
    'Spread': '/images/misc/spread.png',
  },

  // Weapon Slot Logos
  weaponSlots: {
    'Primary': '/images/misc/primary.png',
    'Power': '/images/misc/power.png',
  },

  // Element Logos
  elements: {
    'Arc': '/images/elements/arc.png',
    'Solar': '/images/elements/solar.png',
    'Void': '/images/elements/void.png',
  },

  // Rarity Star Logo
  rarity: '/images/misc/rarity.png',

  // Character Images
  characters: {
    'Attal': '/images/characters/attal-C2V2Ha8t.webp',
    'Estela': '/images/characters/estela-IhYtsiMa.webp',
    'Finnala': '/images/characters/finnala-NGJzMvVP.webp',
    'Gwynn': '/images/characters/gwynn-B6cpq0AA.webp',
    'Ikora': '/images/characters/ikora-0owur8Bl.webp',
    'Jolder': '/images/characters/jolder-CbIz-hOD.webp',
    'Kabr': '/images/characters/kabr-Cbp23cz9.webp',
    'Ning Fei': '/images/characters/ning-fei-DAZR8Oof.webp',
    'Tan-2': '/images/characters/tan-2-DNTTsPtb.webp',
    'Umeko': '/images/characters/umeko-CT8Yh91G.webp',
    'Wolf': '/images/characters/wolf-BF14F-a4.webp',
    'Xuan Wei': '/images/characters/xuan-wei-BNNP8oku.webp',
  }
} as const;

// Helper function to get combat style image
export const getCombatStyleImage = (combatStyle: string): string | null => {
  return ASSET_PATHS.combatStyles[combatStyle as keyof typeof ASSET_PATHS.combatStyles] || null;
};

// Helper function to get weapon slot image
export const getWeaponSlotImage = (slot: string): string | null => {
  return ASSET_PATHS.weaponSlots[slot as keyof typeof ASSET_PATHS.weaponSlots] || null;
};

// Helper function to get element image
export const getElementImage = (element: string): string | null => {
  return ASSET_PATHS.elements[element as keyof typeof ASSET_PATHS.elements] || null;
};

// Helper function to get character image
export const getCharacterImage = (characterName: string): string | null => {
  return ASSET_PATHS.characters[characterName as keyof typeof ASSET_PATHS.characters] || null;
};

// Helper function to generate rarity stars data
export const getRarityStarsData = (rarity: number) => {
  return Array.from({ length: rarity }, (_, i) => ({
    key: i,
    src: ASSET_PATHS.rarity,
    alt: 'star',
    className: 'w-4 h-4 inline-block'
  }));
};

// Combat Style types for type safety
export type CombatStyleType = keyof typeof ASSET_PATHS.combatStyles;
export type WeaponSlotType = keyof typeof ASSET_PATHS.weaponSlots;
export type ElementType = keyof typeof ASSET_PATHS.elements;
export type CharacterType = keyof typeof ASSET_PATHS.characters;