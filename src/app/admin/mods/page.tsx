'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

interface ModAttribute {
  id: number;
  name: string;
  statBonus?: string;
}

interface ModRarity {
  id: number;
  name: string;
  mainAttributeCount: number;
  randomAttributeCount: number;
  colorCode?: string;
}

interface WeaponPerk {
  id: number;
  name: string;
  slot: number;
  upgradeDescription?: string;
}

interface WeaponMod {
  id: number;
  name: string;
  category: string;
  rarity?: {
    name: string;
    colorCode?: string;
  };
  description?: string;
  combatStyle?: string;
  unlocksPerkUpgrade: boolean;
  mainAttributes?: ModAttribute[];
  randomAttributes?: ModAttribute[];
  upgradablePerks?: WeaponPerk[];
}

export default function AdminModsPage() {
  const [mods, setMods] = useState<WeaponMod[]>([]);
  const [attributes, setAttributes] = useState<ModAttribute[]>([]);
  const [rarities, setRarities] = useState<ModRarity[]>([]);
  const [perks, setPerks] = useState<WeaponPerk[]>([]);
  const [loading, setLoading] = useState(true);

  const [newMod, setNewMod] = useState({
    name: '',
    category: 'Ammo',
    rarityId: 0,
    description: '',
    combatStyle: '',
    unlocksPerkUpgrade: false,
    mainAttributeIds: [] as number[],
    randomAttributeIds: [] as number[],
    upgradablePerkIds: [] as number[],
    perkUpgradeDescriptions: {} as Record<number, string>
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [modsRes, attrsRes, raritiesRes, perksRes] = await Promise.all([
        fetch('/api/mods'),
        fetch('/api/mod-attributes'),
        fetch('/api/mod-rarities'),
        fetch('/api/perks')
      ]);

      const modsData = await modsRes.json();
      const attrsData = await attrsRes.json();
      const raritiesData = await raritiesRes.json();
      const perksData = await perksRes.json();

      setMods(modsData.mods || []);
      setAttributes(attrsData.attributes || []);
      setRarities(raritiesData.rarities || []);
      setPerks(perksData.perks || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/mods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMod,
          rarityId: newMod.rarityId || null
        })
      });
      if (res.ok) {
        setNewMod({
          name: '',
          category: 'Ammo',
          rarityId: 0,
          description: '',
          combatStyle: '',
          unlocksPerkUpgrade: false,
          mainAttributeIds: [],
          randomAttributeIds: [],
          upgradablePerkIds: [],
          perkUpgradeDescriptions: {}
        });
        loadData();
        alert('Mod created!');
      }
    } catch (error) {
      console.error('Error creating mod:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete mod "${name}"?`)) return;
    try {
      await fetch(`/api/mods/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting mod:', error);
    }
  };

  const toggleMainAttribute = (id: number) => {
    setNewMod(prev => ({
      ...prev,
      mainAttributeIds: prev.mainAttributeIds.includes(id)
        ? prev.mainAttributeIds.filter(attrId => attrId !== id)
        : [...prev.mainAttributeIds, id]
    }));
  };

  const toggleRandomAttribute = (id: number) => {
    setNewMod(prev => ({
      ...prev,
      randomAttributeIds: prev.randomAttributeIds.includes(id)
        ? prev.randomAttributeIds.filter(attrId => attrId !== id)
        : [...prev.randomAttributeIds, id]
    }));
  };

  const toggleUpgradablePerk = (id: number) => {
    setNewMod(prev => ({
      ...prev,
      upgradablePerkIds: prev.upgradablePerkIds.includes(id)
        ? prev.upgradablePerkIds.filter(perkId => perkId !== id)
        : [...prev.upgradablePerkIds, id]
    }));
  };

  const updatePerkUpgradeDescription = (perkId: number, description: string) => {
    setNewMod(prev => ({
      ...prev,
      perkUpgradeDescriptions: {
        ...prev.perkUpgradeDescriptions,
        [perkId]: description
      }
    }));
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Weapon Mods</h1>
        </div>

        {/* Create Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Mod</h2>
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2">Mod Name</label>
                <input
                  type="text"
                  required
                  value={newMod.name}
                  onChange={(e) => setNewMod({...newMod, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Category</label>
                <select
                  value={newMod.category}
                  onChange={(e) => setNewMod({...newMod, category: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value="Ammo">Ammo</option>
                  <option value="Scope">Scope</option>
                  <option value="Magazine">Magazine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Rarity</label>
                <select
                  value={newMod.rarityId}
                  onChange={(e) => setNewMod({...newMod, rarityId: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value={0}>Select Rarity</option>
                  {rarities.map(rarity => (
                    <option key={rarity.id} value={rarity.id}>
                      {rarity.name} ({rarity.mainAttributeCount} main + {rarity.randomAttributeCount} random)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Combat Style</label>
                <select
                  value={newMod.combatStyle}
                  onChange={(e) => setNewMod({...newMod, combatStyle: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value="">Any (Universal)</option>
                  <option value="Piercing">Piercing</option>
                  <option value="Impact">Impact</option>
                  <option value="Spread">Spread</option>
                  <option value="Rapid-Fire">Rapid-Fire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Description</label>
                <input
                  type="text"
                  value={newMod.description}
                  onChange={(e) => setNewMod({...newMod, description: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Main Attributes */}
            <div>
              <label className="block text-sm mb-2 font-semibold">Main Attributes (Always Active)</label>
              <div className="grid grid-cols-3 gap-2 bg-gray-700 p-4 rounded">
                {attributes.map(attr => (
                  <label key={attr.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMod.mainAttributeIds.includes(attr.id)}
                      onChange={() => toggleMainAttribute(attr.id)}
                      className="form-checkbox"
                    />
                    <span className="text-sm">{attr.name} <span className="text-green-400 text-xs">({attr.statBonus})</span></span>
                  </label>
                ))}
              </div>
            </div>

            {/* Random Attributes Pool */}
            <div>
              <label className="block text-sm mb-2 font-semibold">Random Attributes Pool</label>
              <div className="grid grid-cols-3 gap-2 bg-gray-700 p-4 rounded">
                {attributes.map(attr => (
                  <label key={attr.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMod.randomAttributeIds.includes(attr.id)}
                      onChange={() => toggleRandomAttribute(attr.id)}
                      className="form-checkbox"
                    />
                    <span className="text-sm">{attr.name} <span className="text-yellow-400 text-xs">({attr.statBonus})</span></span>
                  </label>
                ))}
              </div>
            </div>

            {/* Perk Upgrades */}
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={newMod.unlocksPerkUpgrade}
                  onChange={(e) => setNewMod({...newMod, unlocksPerkUpgrade: e.target.checked})}
                  className="form-checkbox"
                />
                <span className="font-semibold">Unlocks Perk Upgrades</span>
              </label>

              {newMod.unlocksPerkUpgrade && (
                <div className="bg-gray-700 p-4 rounded space-y-3">
                  {perks.map(perk => (
                    <div key={perk.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={newMod.upgradablePerkIds.includes(perk.id)}
                        onChange={() => toggleUpgradablePerk(perk.id)}
                        className="form-checkbox mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{perk.name}</div>
                        {newMod.upgradablePerkIds.includes(perk.id) && (
                          <input
                            type="text"
                            placeholder="Upgrade description (e.g., Increases duration by 2s)"
                            value={newMod.perkUpgradeDescriptions[perk.id] || ''}
                            onChange={(e) => updatePerkUpgradeDescription(perk.id, e.target.value)}
                            className="mt-1 w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
              Create Mod
            </button>
          </form>
        </div>

        {/* Mods List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Rarity</th>
                <th className="px-6 py-3 text-left">Combat Style</th>
                <th className="px-6 py-3 text-left">Main Attributes</th>
                <th className="px-6 py-3 text-left">Random Pool</th>
                <th className="px-6 py-3 text-left">Perk Upgrades</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mods.map(mod => (
                <tr key={mod.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium">{mod.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-600 rounded text-xs">{mod.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    {mod.rarity && (
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: mod.rarity.colorCode || '#666' }}
                      >
                        {mod.rarity.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{mod.combatStyle || 'Universal'}</td>
                  <td className="px-6 py-4 text-sm">
                    {mod.mainAttributes?.map(attr => (
                      <div key={attr.id} className="text-green-400 text-xs">{attr.name}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {mod.randomAttributes?.map(attr => (
                      <div key={attr.id} className="text-yellow-400 text-xs">{attr.name}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {mod.upgradablePerks?.map(perk => (
                      <div key={perk.id} className="text-purple-400 text-xs">{perk.name}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(mod.id, mod.name)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
