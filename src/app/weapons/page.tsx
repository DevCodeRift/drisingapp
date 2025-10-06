'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Weapon } from '@/types/weapons';
import { useTheme } from '@/contexts/ThemeContext';

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
      const response = await fetch('/api/weapons?limit=1000'); // Get all weapons for sidebar counts
      const data = await response.json();
      setAllWeapons(data.data || []);
    } catch (error) {
      console.error('Error fetching all weapons:', error);
    }
  };

  const fetchWeapons = async () => {
    // If no filters applied, use allWeapons that we already fetched
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
      case 6: return { border: 'border-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-400/10' }; // Gold for 6 star
      case 5: return { border: 'border-orange-400', text: 'text-orange-400', bg: 'bg-orange-400/10' }; // Orange for 5 star
      case 4: return { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-400/10' }; // Purple for 4 star
      case 3: return { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-400/10' }; // Blue for 3 star
      default: return { border: 'border-gray-400', text: 'text-gray-400', bg: 'bg-gray-400/10' };
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text.primary
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex">
        {/* Left Sidebar - Weapon Type Filters */}
        <div
          className="w-80 min-h-screen"
          style={{
            backgroundColor: colors.surface
          }}
        >
          {/* Top buttons */}
          <div
            className="p-4 border-b"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-sm rounded border transition-colors"
                style={{
                  backgroundColor: colors.button.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border.primary
                }}
              >
                All Characters
              </button>
              <button
                className="px-4 py-2 text-sm rounded border transition-colors"
                style={{
                  backgroundColor: colors.button.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border.primary
                }}
              >
                Filter Weapons
              </button>
            </div>
          </div>

          {/* Weapon type filters */}
          <div className="p-4">
            <div
              className="rounded-lg"
              style={{ backgroundColor: colors.button.secondary }}
            >
              <button
                onClick={() => setFilters(prev => ({ ...prev, weaponType: '' }))}
                className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: !filters.weaponType ? colors.primary : 'transparent',
                  color: !filters.weaponType ? '#ffffff' : colors.text.primary
                }}
              >
                ALL WEAPONS
                <span className="float-right text-xs opacity-60">
                  {!filters.weaponType ? `[${weapons.length}]` : ''}
                </span>
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {weaponTypes.map(type => {
                const count = allWeapons.filter(w => w.weaponType === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setFilters(prev => ({ ...prev, weaponType: type }))}
                    className="w-full text-left px-4 py-2 text-sm rounded transition-colors"
                    style={{
                      backgroundColor: filters.weaponType === type ? colors.primary : 'transparent',
                      color: filters.weaponType === type ? '#ffffff' : colors.text.secondary
                    }}
                  >
                    {type.toUpperCase()}
                    <span className="float-right text-xs opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1 backdrop-blur-md rounded-2xl border-2 shadow-2xl"
          style={{
            background: colors.surface,
            borderColor: colors.border.primary,
            boxShadow: `0 0 40px ${colors.primary}20`
          }}
        >
          {/* Header with slot filters and results count */}
          <div
            className="flex justify-between items-center p-8 border-b-2"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="flex gap-4">
              <motion.button
                onClick={() => setFilters(prev => ({ ...prev, slot: '' }))}
                className="px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 border-2 uppercase tracking-wider"
                style={{
                  background: !filters.slot ? `linear-gradient(45deg, ${colors.primary}, ${colors.accent})` : colors.button.secondary,
                  color: !filters.slot ? '#ffffff' : colors.text.primary,
                  borderColor: !filters.slot ? colors.accent : colors.border.primary,
                  boxShadow: !filters.slot ? `0 4px 15px ${colors.primary}40` : '0 2px 8px rgba(0,0,0,0.1)',
                  textShadow: !filters.slot ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(0,0,0,0.2)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎯 All Slots
              </motion.button>
              <motion.button
                onClick={() => setFilters(prev => ({ ...prev, slot: 'Primary' }))}
                className="px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 border-2 uppercase tracking-wider"
                style={{
                  background: filters.slot === 'Primary' ? `linear-gradient(45deg, ${colors.primary}, ${colors.accent})` : colors.button.secondary,
                  color: filters.slot === 'Primary' ? '#ffffff' : colors.text.primary,
                  borderColor: filters.slot === 'Primary' ? colors.accent : colors.border.primary,
                  boxShadow: filters.slot === 'Primary' ? `0 4px 15px ${colors.primary}40` : '0 2px 8px rgba(0,0,0,0.1)',
                  textShadow: filters.slot === 'Primary' ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(0,0,0,0.2)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Primary
              </motion.button>
              <motion.button
                onClick={() => setFilters(prev => ({ ...prev, slot: 'Power' }))}
                className="px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 border-2 uppercase tracking-wider"
                style={{
                  background: filters.slot === 'Power' ? `linear-gradient(45deg, ${colors.primary}, ${colors.accent})` : colors.button.secondary,
                  color: filters.slot === 'Power' ? '#ffffff' : colors.text.primary,
                  borderColor: filters.slot === 'Power' ? colors.accent : colors.border.primary,
                  boxShadow: filters.slot === 'Power' ? `0 4px 15px ${colors.primary}40` : '0 2px 8px rgba(0,0,0,0.1)',
                  textShadow: filters.slot === 'Power' ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(0,0,0,0.2)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💥 Power
              </motion.button>
            </div>
            <div
              className="text-lg font-bold flex items-center gap-3"
              style={{ color: colors.text.primary, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
            >
              <Star className="w-5 h-5" style={{ color: colors.accent }} />
              Results: <span style={{ color: colors.primary }}>{loading ? '...' : weapons.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="p-8">
            {/* Table Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border-2 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${colors.surface}, ${colors.button.secondary})`,
                borderColor: colors.border.primary,
                boxShadow: `0 0 30px ${colors.primary}20`
              }}
            >
              <div
                className="grid grid-cols-12 gap-6 px-8 py-6 border-b-2"
                style={{
                  borderColor: colors.border.primary,
                  background: `linear-gradient(90deg, ${colors.primary}20, ${colors.accent}20)`
                }}
              >
                <div
                  className="col-span-5 text-lg font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{
                    color: colors.text.primary,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  🎯 Weapon Name
                </div>
                <div
                  className="col-span-2 text-lg font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{
                    color: colors.text.primary,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  ⚔️ Combat Style
                </div>
                <div
                  className="col-span-2 text-lg font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{
                    color: colors.text.primary,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  📦 Slot
                </div>
                <div
                  className="col-span-3 text-lg font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{
                    color: colors.text.primary,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  👥 Characters
                </div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div
                  className="px-6 py-12 text-center"
                  style={{ color: colors.text.secondary }}
                >
                  Loading weapons...
                </div>
              ) : weapons.length === 0 ? (
                <div
                  className="px-6 py-12 text-center"
                  style={{ color: colors.text.secondary }}
                >
                  No weapons found matching your filters
                </div>
              ) : (
                <div>
                  {weapons.map((weapon, index) => {
                    const rarityColors = getRarityColors(weapon.rarity);
                    return (
                      <div
                        key={weapon.id}
                        className="grid grid-cols-12 gap-6 px-6 py-4 transition-colors cursor-pointer"
                        style={{
                          borderBottom: index !== weapons.length - 1 ? `1px solid ${colors.border.primary}` : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.button.secondary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => router.push(`/weapons/${weapon.slug}`)}
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
                              <div className="flex items-center justify-center h-full text-xs" style={{ color: colors.text.secondary }}>
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
                              <span style={{ color: colors.text.secondary }}>{weapon.weaponType}</span>
                              <span
                                className="px-2 py-0.5 rounded text-xs"
                                style={{
                                  backgroundColor: weapon.element === 'Arc' ? 'rgb(37 99 235 / 0.2)' :
                                                   weapon.element === 'Solar' ? 'rgb(249 115 22 / 0.2)' :
                                                   weapon.element === 'Void' ? 'rgb(147 51 234 / 0.2)' :
                                                   `${colors.text.secondary}20`,
                                  color: weapon.element === 'Arc' ? '#60a5fa' :
                                         weapon.element === 'Solar' ? '#fb923c' :
                                         weapon.element === 'Void' ? '#a78bfa' :
                                         colors.text.secondary
                                }}
                              >
                                {weapon.element}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Combat Style Column */}
                        <div className="col-span-2 flex items-center">
                          <span className="font-medium" style={{ color: colors.text.primary }}>{weapon.combatStyle}</span>
                        </div>

                        {/* Slot Column */}
                        <div className="col-span-2 flex items-center">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded text-sm font-medium border"
                            style={{
                              backgroundColor: weapon.slot === 'Primary' ? 'rgb(20 83 45 / 0.5)' : 'rgb(88 28 135 / 0.5)',
                              color: weapon.slot === 'Primary' ? '#86efac' : '#d8b4fe',
                              borderColor: weapon.slot === 'Primary' ? '#16a34a' : '#9333ea'
                            }}
                          >
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
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}