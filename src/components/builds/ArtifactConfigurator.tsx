'use client';

import {
  ARTIFACTS_BY_SLOT,
  formatArtifactName,
  getArtifactImagePath,
  ARTIFACT_RARITIES,
  getAttributeCountForRarity,
  type ArtifactSlot,
  type ArtifactRarity
} from '@/lib/artifact-assets';

interface ArtifactData {
  slot: number;
  artifactName: string;
  rarity: string;
  power: number;
  gearLevel: number;
  enhancementLevel: number;
  attributes: { name: string; description: string }[];
}

interface Props {
  artifacts: ArtifactData[];
  onChange: (artifacts: ArtifactData[]) => void;
}

export default function ArtifactConfigurator({ artifacts, onChange }: Props) {
  const handleArtifactChange = (slotIndex: number, field: string, value: any) => {
    const newArtifacts = [...artifacts];
    newArtifacts[slotIndex] = { ...newArtifacts[slotIndex], [field]: value };

    // Update attributes count based on rarity
    if (field === 'rarity') {
      const count = getAttributeCountForRarity(value as ArtifactRarity);
      const currentAttrs = newArtifacts[slotIndex].attributes;
      if (currentAttrs.length < count) {
        newArtifacts[slotIndex].attributes = [
          ...currentAttrs,
          ...Array(count - currentAttrs.length).fill({ name: '', description: '' })
        ];
      } else if (currentAttrs.length > count) {
        newArtifacts[slotIndex].attributes = currentAttrs.slice(0, count);
      }
    }

    onChange(newArtifacts);
  };

  const handleAttributeChange = (slotIndex: number, attrIndex: number, field: string, value: string) => {
    const newArtifacts = [...artifacts];
    newArtifacts[slotIndex].attributes[attrIndex] = {
      ...newArtifacts[slotIndex].attributes[attrIndex],
      [field]: value
    };
    onChange(newArtifacts);
  };

  return (
    <div className="space-y-6">
      {artifacts.map((artifact, slotIndex) => (
        <div key={artifact.slot} className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Artifact Slot {artifact.slot}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Artifact Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Select Artifact</label>
              <select
                value={artifact.artifactName}
                onChange={(e) => handleArtifactChange(slotIndex, 'artifactName', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="">-- Select Artifact --</option>
                {ARTIFACTS_BY_SLOT[artifact.slot as ArtifactSlot].map((name) => (
                  <option key={name} value={name}>
                    {formatArtifactName(name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Artifact Image Preview */}
            {artifact.artifactName && (
              <div className="md:col-span-2 flex justify-center py-4">
                <div className="relative">
                  <img
                    src={getArtifactImagePath(artifact.slot as ArtifactSlot, artifact.artifactName)}
                    alt={formatArtifactName(artifact.artifactName)}
                    className="w-32 h-32 object-contain rounded-lg border-2 border-gray-300 dark:border-gray-600 p-2"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Slot {artifact.slot}
                  </div>
                </div>
              </div>
            )}

            {/* Rarity */}
            <div>
              <label className="block text-sm font-medium mb-2">Rarity</label>
              <select
                value={artifact.rarity}
                onChange={(e) => handleArtifactChange(slotIndex, 'rarity', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
              >
                {ARTIFACT_RARITIES.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </select>
            </div>

            {/* Power */}
            <div>
              <label className="block text-sm font-medium mb-2">Power</label>
              <input
                type="number"
                value={artifact.power}
                onChange={(e) => handleArtifactChange(slotIndex, 'power', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                placeholder="e.g., 1500"
              />
            </div>

            {/* Gear Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Gear Level</label>
              <input
                type="number"
                value={artifact.gearLevel}
                onChange={(e) => handleArtifactChange(slotIndex, 'gearLevel', parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                placeholder="e.g., 60"
              />
            </div>

            {/* Enhancement Level */}
            <div>
              <label className="block text-sm font-medium mb-2">Enhancement Level</label>
              <input
                type="number"
                value={artifact.enhancementLevel}
                onChange={(e) =>
                  handleArtifactChange(slotIndex, 'enhancementLevel', parseInt(e.target.value) || 0)
                }
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                placeholder="e.g., 20"
              />
            </div>
          </div>

          {/* Attributes */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">
                Attributes ({artifact.attributes.length})
                {artifact.rarity === 'Exotic' && (
                  <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">4 attributes for Exotic</span>
                )}
              </h4>
              <span className="text-xs text-gray-500">All fields are free text</span>
            </div>
            <div className="space-y-3">
              {artifact.attributes.map((attr, attrIndex) => (
                <div key={attrIndex} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="block text-xs font-medium mb-2 text-gray-600 dark:text-gray-400">
                    Attribute {attrIndex + 1}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={attr.name}
                      onChange={(e) => handleAttributeChange(slotIndex, attrIndex, 'name', e.target.value)}
                      placeholder={`Attribute ${attrIndex + 1} Name (e.g., HP +15%)`}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={attr.description}
                      onChange={(e) => handleAttributeChange(slotIndex, attrIndex, 'description', e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
