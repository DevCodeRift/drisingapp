'use client';

import { useState, useEffect } from 'react';

interface WeaponData {
  weaponId: string | null;
  slot: string;
  customName: string;
  gearLevel: number;
  enhancementLevel: number;
  rarity: number;
  traits: { name: string; description: string; effect: string }[];
  perks: { name: string; description: string; effect: string }[];
  catalysts: { name: string; description: string; effect: string }[];
  mods: { name: string; description: string; effect: string }[];
}

interface Props {
  slot: 'Primary' | 'Power';
  weapons: any[];
  weaponData: WeaponData;
  onChange: (data: WeaponData) => void;
}

export default function WeaponConfigurator({ slot, weapons, weaponData, onChange }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);

  const isExotic = selectedWeapon?.rarity === 6 || weaponData.rarity === 6;

  const filteredWeapons = Array.isArray(weapons) ? weapons.filter(w =>
    w.slot === slot &&
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleWeaponSelect = (weapon: any) => {
    setSelectedWeapon(weapon);
    onChange({
      ...weaponData,
      weaponId: weapon.id,
      customName: weapon.name,
      rarity: weapon.rarity
    });
    setShowSearch(false);
    setSearchTerm('');
  };

  const updateField = (field: string, value: any) => {
    onChange({ ...weaponData, [field]: value });
  };

  const addItem = (type: 'traits' | 'perks' | 'catalysts' | 'mods') => {
    const newItem = { name: '', description: '', effect: '' };
    onChange({
      ...weaponData,
      [type]: [...weaponData[type], newItem]
    });
  };

  const updateItem = (type: 'traits' | 'perks' | 'catalysts' | 'mods', index: number, field: string, value: string) => {
    const items = [...weaponData[type]];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...weaponData, [type]: items });
  };

  const removeItem = (type: 'traits' | 'perks' | 'catalysts' | 'mods', index: number) => {
    const items = weaponData[type].filter((_, i) => i !== index);
    onChange({ ...weaponData, [type]: items });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4">{slot} Weapon</h3>

      {/* Weapon Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Base Weapon</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-left flex items-center justify-between"
          >
            <span>{selectedWeapon ? selectedWeapon.name : 'Search weapons...'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {showSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-4 py-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none"
                autoFocus
              />
              {filteredWeapons.map((weapon) => (
                <button
                  key={weapon.id}
                  type="button"
                  onClick={() => handleWeaponSelect(weapon)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                >
                  {weapon.imageUrl && (
                    <img src={weapon.imageUrl} alt={weapon.name} className="w-10 h-10 object-contain rounded" />
                  )}
                  <div>
                    <div className="font-medium">{weapon.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {weapon.weaponType} • {weapon.element} • {weapon.rarity}★
                    </div>
                  </div>
                </button>
              ))}
              {filteredWeapons.length === 0 && (
                <div className="px-4 py-3 text-gray-500 text-center">No weapons found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Name Override */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-3">
          <label className="block text-sm font-medium mb-2">Custom Name (Optional)</label>
          <input
            type="text"
            value={weaponData.customName}
            onChange={(e) => updateField('customName', e.target.value)}
            placeholder="Override weapon name..."
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gear Level</label>
          <input
            type="number"
            value={weaponData.gearLevel}
            onChange={(e) => updateField('gearLevel', parseInt(e.target.value) || 0)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Enhancement Level</label>
          <input
            type="number"
            value={weaponData.enhancementLevel}
            onChange={(e) => updateField('enhancementLevel', parseInt(e.target.value) || 0)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
          />
        </div>
      </div>

      {/* Traits */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Traits</h4>
          <button
            type="button"
            onClick={() => addItem('traits')}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            + Add Trait
          </button>
        </div>
        {weaponData.traits.map((trait, idx) => (
          <div key={idx} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={trait.name}
                  onChange={(e) => updateItem('traits', idx, 'name', e.target.value)}
                  placeholder="Trait name"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={trait.description}
                  onChange={(e) => updateItem('traits', idx, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={trait.effect}
                  onChange={(e) => updateItem('traits', idx, 'effect', e.target.value)}
                  placeholder="Effect"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem('traits', idx)}
                className="text-red-600 hover:text-red-700 mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Perks */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Perks</h4>
          <button
            type="button"
            onClick={() => addItem('perks')}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            + Add Perk
          </button>
        </div>
        {weaponData.perks.map((perk, idx) => (
          <div key={idx} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={perk.name}
                  onChange={(e) => updateItem('perks', idx, 'name', e.target.value)}
                  placeholder="Perk name"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={perk.description}
                  onChange={(e) => updateItem('perks', idx, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={perk.effect}
                  onChange={(e) => updateItem('perks', idx, 'effect', e.target.value)}
                  placeholder="Effect"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem('perks', idx)}
                className="text-red-600 hover:text-red-700 mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Catalysts */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Catalysts</h4>
          <button
            type="button"
            onClick={() => addItem('catalysts')}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            + Add Catalyst
          </button>
        </div>
        {weaponData.catalysts.map((catalyst, idx) => (
          <div key={idx} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={catalyst.name}
                  onChange={(e) => updateItem('catalysts', idx, 'name', e.target.value)}
                  placeholder="Catalyst name"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={catalyst.description}
                  onChange={(e) => updateItem('catalysts', idx, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={catalyst.effect}
                  onChange={(e) => updateItem('catalysts', idx, 'effect', e.target.value)}
                  placeholder="Effect"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem('catalysts', idx)}
                className="text-red-600 hover:text-red-700 mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mods - Disabled for Exotic weapons */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Mods</h4>
          {isExotic ? (
            <span className="text-sm text-gray-500 italic">Disabled for Exotic weapons</span>
          ) : (
            <button
              type="button"
              onClick={() => addItem('mods')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              + Add Mod
            </button>
          )}
        </div>
        {!isExotic && weaponData.mods.map((mod, idx) => (
          <div key={idx} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={mod.name}
                  onChange={(e) => updateItem('mods', idx, 'name', e.target.value)}
                  placeholder="Mod name"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={mod.description}
                  onChange={(e) => updateItem('mods', idx, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={mod.effect}
                  onChange={(e) => updateItem('mods', idx, 'effect', e.target.value)}
                  placeholder="Effect"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem('mods', idx)}
                className="text-red-600 hover:text-red-700 mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {isExotic && (
          <div className="text-center py-4 text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg">
            Exotic weapons cannot use mods
          </div>
        )}
      </div>
    </div>
  );
}
