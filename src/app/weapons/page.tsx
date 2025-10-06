'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Weapon } from '@/types/weapons';
import Navigation from '@/components/Navigation';

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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Weapons Database</h1>
          <p className="text-base sm:text-lg text-gray-700">Browse and discover all weapons in Destiny Rising</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-4">
            {/* Slot Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Slot</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, slot: '' }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${getFilterButtonStyle(!filters.slot, 'primary')}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, slot: 'Primary' }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${getFilterButtonStyle(filters.slot === 'Primary', 'primary')}`}
                >
                  Primary
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, slot: 'Power' }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${getFilterButtonStyle(filters.slot === 'Power', 'primary')}`}
                >
                  Power
                </button>
              </div>
            </div>

            {/* Element Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Element</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, element: '' }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${getFilterButtonStyle(!filters.element)}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, element: 'Arc' }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    filters.element === 'Arc'
                      ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                      : 'bg-white text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Arc
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, element: 'Solar' }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    filters.element === 'Solar'
                      ? 'bg-orange-600 text-white border border-orange-600 shadow-sm'
                      : 'bg-white text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Solar
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, element: 'Void' }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    filters.element === 'Void'
                      ? 'bg-purple-600 text-white border border-purple-600 shadow-sm'
                      : 'bg-white text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Void
                </button>
              </div>
            </div>
          </div>

          {/* Weapon Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Weapon Type</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, weaponType: '' }))}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${getFilterButtonStyle(!filters.weaponType)}`}
              >
                All Types
              </button>
              {weaponTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, weaponType: type }))}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${getFilterButtonStyle(filters.weaponType === type)}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.slot || filters.weaponType || filters.element) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors min-h-[44px] flex items-center"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${weapons.length} weapons found`}
          </p>
        </div>

        {/* Weapons Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading weapons...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {weapons.map(weapon => (
              <div
                key={weapon.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/weapons/${weapon.id}`)}
              >
                {/* Weapon Image */}
                <div className="aspect-square bg-gray-100 p-4 flex items-center justify-center">
                  {weapon.imageUrl ? (
                    <img
                      src={weapon.imageUrl}
                      alt={weapon.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Weapon Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{weapon.name}</h3>

                  {/* Weapon Type */}
                  <p className="text-sm text-gray-600 mb-2">{weapon.weaponType}</p>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Element */}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getElementColor(weapon.element)}`}>
                      {weapon.element}
                    </span>

                    {/* Rarity */}
                    <span className="text-yellow-500 text-sm">
                      {getRarityStars(weapon.rarity)}
                    </span>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{weapon.slot}</span>
                    <span>{weapon.combatStyle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && weapons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-700 mb-4 text-lg">No weapons found matching your filters</div>
            <button
              onClick={clearFilters}
              className="px-6 py-3 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors min-h-[44px] inline-flex items-center"
            >
              Clear filters to see all weapons
            </button>
          </div>
        )}
      </div>
    </div>
  );
}