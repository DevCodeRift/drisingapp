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

      <div className="flex min-h-screen">
        {/* Left Sidebar - Weapon Type Filters */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, slot: '' }))}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  !filters.slot
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Characters
              </button>
              <button className="px-3 py-2 rounded text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                Filter Weapons
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, weaponType: '' }))}
              className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                !filters.weaponType
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              ALL WEAPONS
            </button>
            {weaponTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, weaponType: type }))}
                className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                  filters.weaponType === type
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header with Results Count */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, slot: '' }))}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  !filters.slot
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Slots
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, slot: 'Primary' }))}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  filters.slot === 'Primary'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Primary
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, slot: 'Power' }))}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  filters.slot === 'Power'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Power
              </button>
            </div>
            <div className="text-gray-400">
              Results: {loading ? '...' : weapons.length}
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-gray-800 rounded-t-lg p-4">
            <div className="grid grid-cols-12 gap-4 items-center text-gray-400 text-sm font-medium">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Combat Style</div>
              <div className="col-span-2">Slot</div>
              <div className="col-span-3">Characters</div>
            </div>
          </div>

          {/* Weapons List */}
          {loading ? (
            <div className="bg-gray-800 p-8 text-center text-gray-400">
              Loading weapons...
            </div>
          ) : weapons.length === 0 ? (
            <div className="bg-gray-800 p-8 text-center text-gray-400">
              No weapons found matching your filters
            </div>
          ) : (
            <div className="bg-gray-800 rounded-b-lg">
              {weapons.map((weapon, index) => {
                const rarityColors = getRarityColors(weapon.rarity);
                return (
                  <div
                    key={weapon.id}
                    className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-700 transition-colors cursor-pointer ${
                      index !== weapons.length - 1 ? 'border-b border-gray-700' : ''
                    }`}
                    onClick={() => router.push(`/weapons/${weapon.id}`)}
                  >
                    {/* Name Column with Image */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={`w-16 h-12 ${rarityColors.bg} ${rarityColors.border} border-2 rounded flex items-center justify-center overflow-hidden`}>
                        {weapon.imageUrl ? (
                          <img
                            src={weapon.imageUrl}
                            alt={weapon.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-gray-500 text-xs">No Image</div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {getRarityStars(weapon.rarity)}
                          </span>
                        </div>
                        <h3 className={`font-medium ${rarityColors.text}`}>{weapon.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span>{weapon.weaponType}</span>
                          <span className={`px-1 rounded ${getElementColor(weapon.element)}`}>
                            {weapon.element}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Combat Style Column */}
                    <div className="col-span-2">
                      <span className="text-gray-300">{weapon.combatStyle}</span>
                    </div>

                    {/* Slot Column */}
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        weapon.slot === 'Primary'
                          ? 'bg-green-900 text-green-300 border border-green-700'
                          : 'bg-purple-900 text-purple-300 border border-purple-700'
                      }`}>
                        {weapon.slot}
                      </span>
                    </div>

                    {/* Characters Column */}
                    <div className="col-span-3">
                      <div className="flex gap-1">
                        {/* Placeholder character icons */}
                        <div className="w-6 h-6 bg-gray-700 rounded border border-gray-600"></div>
                        <div className="w-6 h-6 bg-gray-700 rounded border border-gray-600"></div>
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
  );
}