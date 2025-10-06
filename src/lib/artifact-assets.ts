/**
 * Artifact Image Asset Management
 * Centralized system for managing artifact images by slot
 */

export type ArtifactSlot = 1 | 2 | 3 | 4;

// Artifact names organized by slot
export const ARTIFACTS_BY_SLOT = {
  1: [
    'abundant-planetesimal',
    'bulwark-evolution',
    'bulwark-token',
    'chiaroscuro',
    'healing-planetesimal',
    'healing-radiation',
    'inverted-guard',
    'nimble-ground',
    'nimble-veil',
    'nourishing-pact',
    'resolute-conjunction',
    'resolute-nutation',
    'ring-of-abundance',
    'ring-of-healing',
    'talisman-of-revival',
    'unrelenting-ground',
    'unrelenting-shell',
    'unrelenting-subgravity',
    'upright-guard',
    'warding-pact',
  ],
  2: [
    'binging-planetesimal',
    'bloodthirsty-shell',
    'bulwark-pact',
    'fertile-ground',
    'healing-conjunction',
    'healing-ground',
    'healing-nutation',
    'healing-subgravity',
    'healing-veil',
    'inverted-tenacity',
    'pranayama',
    'resolute-radiation',
    'retributive-planetesimal',
    'ring-of-conversion',
    'ring-of-safeguarding',
    'siphoning-pact',
    'talisman-of-luxuriance',
    'unrelenting-evolution',
    'unrelenting-token',
    'upright-tenacity',
  ],
  3: [
    'bellicose-pact',
    'bellicose-precession',
    'bellicose-radiation',
    'bellicose-veil',
    'calming-token',
    'courageous-planetesimal',
    'inverted-fury',
    'jolted-transit',
    'mysterious-submagnetism',
    'predator-evolution',
    'rampaging-pact',
    'ring-of-courage',
    'ring-of-morale',
    'scattering-shell',
    'talisman-of-unity',
    'upright-fury',
    'upright-vengeance',
    'valiant-ground',
    'valiant-subgravity',
  ],
  4: [
    'bellicose-planetesimal',
    'bellicose-subgravity',
    'explosive-shell',
    'hawkeye-token',
    'illuminated-ground',
    'inverted-survival',
    'inverted-vengeance',
    'light-rich-ground',
    'rampaging-planetesimal',
    'rampaging-precession',
    'rampaging-radiation',
    'resonating-pact',
    'resonating-transit',
    'responsive-pact',
    'ring-of-reflection',
    'ring-of-vengeance',
    'sympathetic-evolution',
    'talisman-of-inspiration',
    'upright-survival',
    'valiant-veil',
  ],
} as const;

/**
 * Get artifact image path
 */
export function getArtifactImagePath(slot: ArtifactSlot, artifactName: string): string {
  return `/images/artifacts/slot${slot}/${artifactName}.webp`;
}

/**
 * Get all artifacts for a specific slot
 */
export function getArtifactsForSlot(slot: ArtifactSlot): readonly string[] {
  return ARTIFACTS_BY_SLOT[slot];
}

/**
 * Format artifact name for display (kebab-case to Title Case)
 */
export function formatArtifactName(artifactName: string): string {
  return artifactName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get artifact rarity options
 */
export const ARTIFACT_RARITIES = ['Rare', 'Legendary', 'Mythic', 'Exotic'] as const;
export type ArtifactRarity = typeof ARTIFACT_RARITIES[number];

/**
 * Get number of attributes based on rarity
 */
export function getAttributeCountForRarity(rarity: ArtifactRarity): number {
  switch (rarity) {
    case 'Exotic':
      return 4;
    case 'Mythic':
    case 'Legendary':
    case 'Rare':
    default:
      return 3;
  }
}
