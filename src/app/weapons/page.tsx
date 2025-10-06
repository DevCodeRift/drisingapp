'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Weapon } from '@/types/weapons';
import { useTheme } from '@/contexts/ThemeContext';
import { Filter, Search } from 'lucide-react';

export default function WeaponsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [allWeapons, setAllWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    slot: '',
    weaponType: '',
    element: '',
    rarity: ''
  });

  useEffect(() => {
    fetchAllWeapons();
  }, []);

  useEffect(() => {
    fetchWeapons();
  }, [filters, allWeapons]);

  const fetchAllWeapons = async () => {
    try {
      const response = await fetch('/api/weapons?limit=1000');
      const data = await response.json();
      setAllWeapons(data.data || []);
    } catch (error) {
      console.error('Error fetching all weapons:', error);
    }
  };

  const fetchWeapons = async () => {
    if (!filters.slot && !filters.weaponType && !filters.element && !filters.rarity) {
      setWeapons(allWeapons);
      setLoading(false);
      return;
    }

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

  const getRarityStars = (rarity: number) => {
    return '★'.repeat(rarity);
  };

  const getRarityColors = (rarity: number) => {
    switch (rarity) {
      case 6: return { border: 'border-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-400/10' };
      case 5: return { border: 'border-orange-400', text: 'text-orange-400', bg: 'bg-orange-400/10' };
      case 4: return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400/10' };
      case 3: return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400/10' };
      default: return { border: 'border-gray-400', text: 'text-gray-400', bg: 'bg-gray-400/10' };
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="py-12 px-8" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: colors.text.primary }}
              >
                Weapons
              </h1>
              <p
                className="text-lg"
                style={{ color: colors.text.secondary }}
              >
                Discover and explore the weapon arsenal
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="px-4 py-2 rounded-lg border flex items-center gap-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border.primary,
                  color: colors.text.secondary
                }}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">
                  {loading ? '...' : weapons.length} weapons
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80">
            <div
              className="rounded-lg border p-6 sticky top-8"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border.primary
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" style={{ color: colors.primary }} />
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Filters
                </h2>
              </div>

              {/* Slot Filters */}
              <div className="mb-6">
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: colors.text.secondary }}
                >
                  WEAPON SLOT
                </h3>
                <div className="space-y-2">
                  {['', 'Primary', 'Power'].map((slot) => (
                    <button
                      key={slot || 'all'}
                      onClick={() => setFilters(prev => ({ ...prev, slot }))}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        filters.slot === slot ? 'font-medium' : ''
                      }`}
                      style={{
                        backgroundColor: filters.slot === slot ? colors.button.secondary : 'transparent',
                        color: filters.slot === slot ? colors.primary : colors.text.secondary
                      }}
                    >
                      {slot || 'All Slots'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filters */}
              <div className="mb-6">
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: colors.text.secondary }}
                >
                  WEAPON TYPE
                </h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, weaponType: '' }))}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      !filters.weaponType ? 'font-medium' : ''
                    }`}
                    style={{
                      backgroundColor: !filters.weaponType ? colors.button.secondary : 'transparent',
                      color: !filters.weaponType ? colors.primary : colors.text.secondary
                    }}
                  >
                    All Types ({allWeapons.length})
                  </button>
                  {weaponTypes.map((type) => {
                    const count = allWeapons.filter(w => w.weaponType === type).length;
                    return (
                      <button
                        key={type}
                        onClick={() => setFilters(prev => ({ ...prev, weaponType: type }))}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex justify-between ${
                          filters.weaponType === type ? 'font-medium' : ''
                        }`}
                        style={{
                          backgroundColor: filters.weaponType === type ? colors.button.secondary : 'transparent',
                          color: filters.weaponType === type ? colors.primary : colors.text.secondary
                        }}
                      >
                        <span>{type}</span>
                        <span className="text-xs opacity-60">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colors.primary }}></div>
                  <span style={{ color: colors.text.secondary }}>Loading weapons...</span>
                </div>
              </div>
            ) : weapons.length === 0 ? (
              <div className="text-center py-12">
                <p
                  className="text-lg font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  No weapons found
                </p>
                <p style={{ color: colors.text.secondary }}>
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <div
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border.primary
                }}
              >
                {/* Table Header */}
                <div
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b text-sm font-medium"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.button.secondary,
                    color: colors.text.secondary
                  }}
                >
                  <div className="col-span-5">WEAPON</div>
                  <div className="col-span-2">TYPE</div>
                  <div className="col-span-2">SLOT</div>
                  <div className="col-span-2">ELEMENT</div>
                  <div className="col-span-1">RARITY</div>
                </div>

                {/* Table Body */}
                <div>
                  {weapons.map((weapon, index) => {
                    const rarityColors = getRarityColors(weapon.rarity);
                    return (
                      <motion.div
                        key={weapon.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-colors border-b hover:bg-opacity-50"
                        style={{
                          borderColor: colors.border.secondary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.button.secondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => router.push(`/weapons/${weapon.slug}`)}
                      >
                        {/* Weapon Column */}
                        <div className="col-span-5 flex items-center gap-4">
                          <div
                            className={`w-16 h-12 rounded-md border overflow-hidden ${rarityColors.bg} ${rarityColors.border}`}
                          >
                            {weapon.imageUrl ? (
                              <img
                                src={weapon.imageUrl}
                                alt={weapon.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="flex items-center justify-center h-full text-xs"
                                style={{ color: colors.text.muted }}
                              >
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <h3
                              className="font-medium mb-1"
                              style={{ color: colors.text.primary }}
                            >
                              {weapon.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${rarityColors.text}`}>
                                {getRarityStars(weapon.rarity)}
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: colors.text.muted }}
                              >
                                {weapon.combatStyle}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Type Column */}
                        <div className="col-span-2 flex items-center">
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {weapon.weaponType}
                          </span>
                        </div>

                        {/* Slot Column */}
                        <div className="col-span-2 flex items-center">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: weapon.slot === 'Primary' ? '#10b98120' : '#8b5cf620',
                              color: weapon.slot === 'Primary' ? '#059669' : '#8b5cf6'
                            }}
                          >
                            {weapon.slot}
                          </span>
                        </div>

                        {/* Element Column */}
                        <div className="col-span-2 flex items-center">
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: weapon.element === 'Arc' ? '#3b82f620' :
                                             weapon.element === 'Solar' ? '#f9731620' :
                                             weapon.element === 'Void' ? '#8b5cf620' :
                                             colors.button.secondary,
                              color: weapon.element === 'Arc' ? '#3b82f6' :
                                     weapon.element === 'Solar' ? '#f97316' :
                                     weapon.element === 'Void' ? '#8b5cf6' :
                                     colors.text.secondary
                            }}
                          >
                            {weapon.element}
                          </span>
                        </div>

                        {/* Rarity Column */}
                        <div className="col-span-1 flex items-center">
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.text.secondary }}
                          >
                            {weapon.rarity}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}