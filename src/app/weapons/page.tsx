'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Weapon } from '@/types/weapons';

export default function WeaponsPage() {
  const router = useRouter();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    slot: '',
    weaponType: '',
    element: '',
    rarity: ''
  });

  useEffect(() => {
    fetchWeapons();
  }, [filters]);

  const fetchWeapons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.slot) params.append('slot', filters.slot);
      if (filters.weaponType) params.append('type', filters.weaponType);
      if (filters.element) params.append('element', filters.element);

      const response = await fetch(`/api/weapons?${params.toString()}`);
      const data = await response.json();
      setWeapons(data.data || []);
    } catch (error) {
      console.error('Error fetching weapons:', error);
    } finally {
      setLoading(false);
    }
  };

  const weaponTypes = [
    'Auto Crossbow', 'Auto Rifle', 'Fusion Rifle', 'Grenade Launcher',
    'Hand Cannon', 'Light Grenade Launcher', 'Linear Fusion Rifle',
    'Machine Gun', 'Pulse Rifle', 'Rocket Launcher', 'Scout Rifle',
    'Shotgun', 'Sidearm', 'Sniper Rifle', 'Submachine Gun', 'Sword'
  ];

  const clearFilters = () => {
    setFilters({ slot: '', weaponType: '', element: '', rarity: '' });
  };

  const getFilterButtonStyle = (isActive: boolean, variant: 'primary' | 'secondary' = 'secondary') => {
    if (variant === 'primary') {
      return isActive
        ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-sm'
        : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm';
    }
    return isActive
      ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
      : 'bg-white text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm';
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Arc': return 'text-blue-400 bg-blue-900/20';
      case 'Solar': return 'text-orange-400 bg-orange-900/20';
      case 'Void': return 'text-purple-400 bg-purple-900/20';
      default: return 'text-gray-400 bg-gray-700/20';
    }
  };

  const getRarityStars = (rarity: number) => {
    return '★'.repeat(rarity);
  };

  const getRarityColors = (rarity: number) => {
    switch (rarity) {
      case 6: return { border: 'border-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-400/10' }; // Gold for 6 star
      case 5: return { border: 'border-orange-400', text: 'text-orange-400', bg: 'bg-orange-400/10' }; // Orange for 5 star
      case 4: return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400/10' }; // Purple for 4 star
      case 3: return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400/10' }; // Blue for 3 star
      default: return { border: 'border-gray-400', text: 'text-gray-400', bg: 'bg-gray-400/10' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex">
        {/* Left Sidebar - Weapon Type Filters */}
        <div className="w-80 bg-gray-800 min-h-screen">
          {/* Top buttons */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded border border-gray-600 transition-colors">
                All Characters
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded border border-gray-600 transition-colors">
                Filter Weapons
              </button>
            </div>
          </div>

          {/* Weapon type filters */}
          <div className="p-4">
            <div className="bg-gray-700 rounded-lg">
              <button
                onClick={() => setFilters(prev => ({ ...prev, weaponType: '' }))}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  !filters.weaponType
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                ALL WEAPONS
                <span className="float-right text-xs opacity-60">
                  {!filters.weaponType ? `[${weapons.length}]` : ''}
                </span>
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {weaponTypes.map(type => {
                const count = !filters.weaponType ? weapons.filter(w => w.weaponType === type).length : 0;
                return (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({ ...prev, weaponType: type }))}
                    className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                      filters.weaponType === type
                        ? 'bg-gray-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    }`}
                  >
                    {type.toUpperCase()}
                    {!filters.weaponType && (
                      <span className="float-right text-xs opacity-60">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-900">
          {/* Header with slot filters and results count */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, slot: '' }))}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  !filters.slot
                    ? 'bg-gray-600 text-white border border-gray-500'
                    : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                }`}
              >
                All Slots
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, slot: 'Primary' }))}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  filters.slot === 'Primary'
                    ? 'bg-gray-600 text-white border border-gray-500'
                    : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                }`}
              >
                Primary
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, slot: 'Power' }))}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  filters.slot === 'Power'
                    ? 'bg-gray-600 text-white border border-gray-500'
                    : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                }`}
              >
                Power
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              Results: <span className="text-white font-medium">{loading ? '...' : weapons.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="p-6">
            {/* Table Header */}
            <div className="bg-gray-800 border border-gray-700 rounded-t-lg">
              <div className="grid grid-cols-12 gap-6 px-6 py-4 border-b border-gray-700">
                <div className="col-span-5 text-gray-400 text-sm font-medium uppercase tracking-wider">Name</div>
                <div className="col-span-2 text-gray-400 text-sm font-medium uppercase tracking-wider">Combat Style</div>
                <div className="col-span-2 text-gray-400 text-sm font-medium uppercase tracking-wider">Slot</div>
                <div className="col-span-3 text-gray-400 text-sm font-medium uppercase tracking-wider">Characters</div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  Loading weapons...
                </div>
              ) : weapons.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  No weapons found matching your filters
                </div>
              ) : (
                <div>
                  {weapons.map((weapon, index) => {
                    const rarityColors = getRarityColors(weapon.rarity);
                    return (
                      <div
                        key={weapon.id}
                        className={`grid grid-cols-12 gap-6 px-6 py-4 hover:bg-gray-700 transition-colors cursor-pointer ${
                          index !== weapons.length - 1 ? 'border-b border-gray-700' : ''
                        }`}
                        onClick={() => router.push(`/weapons/${weapon.id}`)}
                      >
                        {/* Name Column */}
                        <div className="col-span-5 flex items-center gap-4">
                          {/* Weapon Image with rarity border */}
                          <div className={`relative w-40 h-16 ${rarityColors.border} border-2 rounded overflow-hidden ${rarityColors.bg}`}>
                            {weapon.imageUrl ? (
                              <img
                                src={weapon.imageUrl}
                                alt={weapon.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Weapon Info */}
                          <div className="flex-1">
                            {/* Rarity stars */}
                            <div className="flex items-center gap-1 mb-1">
                              <span className={`text-sm ${rarityColors.text}`}>
                                {getRarityStars(weapon.rarity)}
                              </span>
                            </div>

                            {/* Weapon name */}
                            <h3 className={`text-lg font-semibold ${rarityColors.text} mb-1 uppercase tracking-wide`}>
                              {weapon.name}
                            </h3>

                            {/* Weapon type and element */}
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-400">{weapon.weaponType}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${getElementColor(weapon.element)}`}>
                                {weapon.element}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Combat Style Column */}
                        <div className="col-span-2 flex items-center">
                          <span className="text-gray-200 font-medium">{weapon.combatStyle}</span>
                        </div>

                        {/* Slot Column */}
                        <div className="col-span-2 flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${
                            weapon.slot === 'Primary'
                              ? 'bg-green-900/50 text-green-300 border-green-600'
                              : 'bg-purple-900/50 text-purple-300 border-purple-600'
                          }`}>
                            {weapon.slot}
                          </span>
                        </div>

                        {/* Characters Column */}
                        <div className="col-span-3 flex items-center">
                          <div className="flex gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded border border-orange-400 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">H</span>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded border border-blue-400 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">W</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}