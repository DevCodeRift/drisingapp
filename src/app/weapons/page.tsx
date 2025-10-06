'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Weapon } from '@/types/weapons';
import { useTheme } from '@/contexts/ThemeContext';
import { Zap, Filter, Star } from 'lucide-react';

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
    <div
      className="min-h-screen"
      style={{ background: colors.background }}
    >
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-8 py-16 text-center"
      >
        <h1
          className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-wider"
          style={{
            color: colors.text.primary,
            textShadow: `0 0 30px ${colors.primary}80, 2px 2px 8px rgba(0,0,0,0.8)`,
            filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.8))'
          }}
        >
          WEAPONS ARSENAL
        </h1>
        <p
          className="text-2xl font-semibold mb-8"
          style={{
            color: colors.text.primary,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          Discover and master the ultimate firepower
        </p>
        <div
          className="w-32 h-1 mx-auto rounded-full"
          style={{ background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})` }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex gap-8">
          {/* Left Sidebar - Weapon Type Filters */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-80 backdrop-blur-md rounded-2xl border-2 shadow-2xl"
            style={{
              background: colors.surface,
              borderColor: colors.border.primary,
              boxShadow: `0 0 40px ${colors.primary}30`
            }}
          >
            {/* Top buttons */}
            <div
              className="p-6 border-b-2"
              style={{ borderColor: colors.border.primary }}
            >
              <h2
                className="text-2xl font-bold mb-4 flex items-center gap-3"
                style={{
                  color: colors.primary,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                <Filter className="w-6 h-6" />
                WEAPON FILTERS
              </h2>
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 text-sm font-bold rounded-xl border-2 transition-all duration-200 uppercase tracking-wider"
                  style={{
                    background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                    color: '#ffffff',
                    borderColor: colors.accent,
                    boxShadow: `0 4px 15px ${colors.primary}40`
                  }}
                >
                  All Characters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 text-sm font-bold rounded-xl border-2 transition-all duration-200 uppercase tracking-wider"
                  style={{
                    background: colors.button.secondary,
                    color: colors.text.primary,
                    borderColor: colors.border.primary,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  Advanced Filters
                </motion.button>
              </div>
            </div>

            {/* Weapon type filters */}
            <div className="p-6">
              <motion.div
                className="rounded-xl border-2 overflow-hidden"
                style={{
                  background: colors.button.secondary,
                  borderColor: colors.border.primary
                }}
              >
                <motion.button
                  onClick={() => setFilters(prev => ({ ...prev, weaponType: '' }))}
                  className="w-full text-left px-6 py-4 text-sm font-bold rounded-xl transition-all duration-200 uppercase tracking-wider flex items-center justify-between"
                  style={{
                    background: !filters.weaponType ? `linear-gradient(45deg, ${colors.primary}, ${colors.accent})` : 'transparent',
                    color: !filters.weaponType ? '#ffffff' : colors.text.primary,
                    textShadow: !filters.weaponType ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    ALL WEAPONS
                  </span>
                  <span className="text-xs opacity-80 font-bold">
                    {!filters.weaponType ? `[${weapons.length}]` : ''}
                  </span>
                </motion.button>
              </motion.div>

              <div className="mt-4 space-y-2">
                {weaponTypes.map((type, index) => {
                  const count = allWeapons.filter(w => w.weaponType === type).length;
                  return (
                    <motion.button
                      key={type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setFilters(prev => ({ ...prev, weaponType: type }))}
                      className="w-full text-left px-6 py-3 text-sm rounded-xl transition-all duration-200 font-semibold uppercase tracking-wide flex items-center justify-between border-2"
                      style={{
                        background: filters.weaponType === type ? `linear-gradient(45deg, ${colors.primary}, ${colors.accent})` : colors.button.secondary,
                        color: filters.weaponType === type ? '#ffffff' : colors.text.primary,
                        borderColor: filters.weaponType === type ? colors.accent : colors.border.secondary,
                        boxShadow: filters.weaponType === type ? `0 4px 15px ${colors.primary}30` : '0 2px 8px rgba(0,0,0,0.1)',
                        textShadow: filters.weaponType === type ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(0,0,0,0.2)'
                      }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{type.toUpperCase()}</span>
                      <span className="text-xs opacity-80 font-bold bg-black/20 px-2 py-1 rounded-full">{count}</span>
                    </motion.button>
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
                  All Slots
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
                  Primary
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
                  Power
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
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b-2"
                  style={{
                    borderColor: colors.border.primary,
                    background: `linear-gradient(90deg, ${colors.primary}20, ${colors.accent}20)`
                  }}
                >
                  <div
                    className="col-span-6 text-sm font-bold uppercase tracking-wider flex items-center"
                    style={{
                      color: colors.text.primary,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    Weapon Name
                  </div>
                  <div
                    className="col-span-2 text-sm font-bold uppercase tracking-wider flex items-center"
                    style={{
                      color: colors.text.primary,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    Combat Style
                  </div>
                  <div
                    className="col-span-2 text-sm font-bold uppercase tracking-wider flex items-center"
                    style={{
                      color: colors.text.primary,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    Slot
                  </div>
                  <div
                    className="col-span-2 text-sm font-bold uppercase tracking-wider flex items-center"
                    style={{
                      color: colors.text.primary,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    Characters
                  </div>
                </div>

                {/* Table Body */}
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-8 py-16 text-center"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full border-4 mx-auto mb-6"
                      style={{
                        borderColor: colors.primary,
                        borderTopColor: 'transparent'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p
                      className="text-xl font-bold"
                      style={{
                        color: colors.text.primary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      Loading Arsenal...
                    </p>
                  </motion.div>
                ) : weapons.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-8 py-16 text-center"
                  >
                    <div
                      className="text-4xl mb-4 font-bold"
                      style={{ color: colors.primary }}
                    >
                      NO RESULTS
                    </div>
                    <p
                      className="text-2xl font-bold mb-4"
                      style={{
                        color: colors.text.primary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      NO WEAPONS FOUND
                    </p>
                    <p
                      className="text-lg"
                      style={{
                        color: colors.text.secondary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      Try adjusting your filters to discover more arsenal
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    {weapons.map((weapon, index) => {
                      const rarityColors = getRarityColors(weapon.rarity);
                      return (
                        <motion.div
                          key={weapon.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="grid grid-cols-12 gap-4 px-6 py-4 transition-all duration-300 cursor-pointer border-b-2"
                          style={{
                            borderBottomColor: index !== weapons.length - 1 ? colors.border.secondary : 'transparent',
                            background: `linear-gradient(90deg, transparent, ${colors.button.secondary}30, transparent)`
                          }}
                          whileHover={{
                            background: `linear-gradient(90deg, ${colors.primary}10, ${colors.accent}20, ${colors.primary}10)`,
                            boxShadow: `0 8px 25px ${colors.primary}20`
                          }}
                          onClick={() => router.push(`/weapons/${weapon.slug}`)}
                        >
                          {/* Name Column */}
                          <div className="col-span-6 flex items-center gap-4">
                            {/* Weapon Image with rarity border */}
                            <motion.div
                              className={`relative w-32 h-24 ${rarityColors.border} border-2 rounded-xl overflow-hidden ${rarityColors.bg} shadow-lg`}
                              whileHover={{ scale: 1.05 }}
                              style={{
                                boxShadow: `0 0 15px ${rarityColors.text.replace('text-', '').replace('-400', '')}30`
                              }}
                            >
                              {weapon.imageUrl ? (
                                <img
                                  src={weapon.imageUrl}
                                  alt={weapon.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className="flex items-center justify-center h-full text-sm font-bold"
                                  style={{
                                    color: colors.text.primary,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  No Image
                                </div>
                              )}
                            </motion.div>

                            {/* Weapon Info */}
                            <div className="flex-1">
                              {/* Rarity stars */}
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-lg ${rarityColors.text} drop-shadow-lg`}>
                                  {getRarityStars(weapon.rarity)}
                                </span>
                                <span
                                  className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide"
                                  style={{
                                    background: `linear-gradient(45deg, ${rarityColors.text.replace('text-', '').replace('-400', '')}40, ${rarityColors.text.replace('text-', '').replace('-400', '')}60)`,
                                    color: rarityColors.text.replace('text-', '#').replace('-400', '')
                                  }}
                                >
                                  {weapon.rarity} STAR
                                </span>
                              </div>

                              {/* Weapon name */}
                              <h3
                                className="text-lg font-bold mb-1 uppercase tracking-wide"
                                style={{
                                  color: colors.text.primary,
                                  textShadow: `1px 1px 2px rgba(0,0,0,0.5)`
                                }}
                              >
                                {weapon.name}
                              </h3>

                              {/* Weapon type and element */}
                              <div className="flex items-center gap-3">
                                <span
                                  className="text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide"
                                  style={{
                                    background: colors.button.secondary,
                                    color: colors.text.primary,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                  }}
                                >
                                  {weapon.weaponType}
                                </span>
                                <motion.span
                                  className="px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                                  style={{
                                    background: weapon.element === 'Arc' ? 'linear-gradient(45deg, #3b82f6, #60a5fa)' :
                                               weapon.element === 'Solar' ? 'linear-gradient(45deg, #f97316, #fb923c)' :
                                               weapon.element === 'Void' ? 'linear-gradient(45deg, #9333ea, #a78bfa)' :
                                               `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                                    color: '#ffffff',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                    boxShadow: `0 2px 8px ${weapon.element === 'Arc' ? '#3b82f6' : weapon.element === 'Solar' ? '#f97316' : weapon.element === 'Void' ? '#9333ea' : colors.primary}40`
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {weapon.element}
                                </motion.span>
                              </div>
                            </div>
                          </div>

                          {/* Combat Style Column */}
                          <div className="col-span-2 flex items-center">
                            <span
                              className="font-semibold text-sm px-3 py-1 rounded-lg border"
                              style={{
                                color: colors.text.primary,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                background: colors.button.secondary,
                                borderColor: colors.border.primary
                              }}
                            >
                              {weapon.combatStyle}
                            </span>
                          </div>

                          {/* Slot Column */}
                          <div className="col-span-2 flex items-center">
                            <motion.span
                              className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border uppercase tracking-wide"
                              style={{
                                background: weapon.slot === 'Primary' ? 'linear-gradient(45deg, #16a34a, #22c55e)' : 'linear-gradient(45deg, #9333ea, #a855f7)',
                                color: '#ffffff',
                                borderColor: weapon.slot === 'Primary' ? '#22c55e' : '#a855f7',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                boxShadow: `0 2px 8px ${weapon.slot === 'Primary' ? '#16a34a' : '#9333ea'}30`
                              }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {weapon.slot}
                            </motion.span>
                          </div>

                          {/* Characters Column */}
                          <div className="col-span-2 flex items-center">
                            <div className="flex gap-2">
                              <motion.div
                                className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg border border-orange-400 flex items-center justify-center shadow-md"
                                whileHover={{ scale: 1.1 }}
                                style={{
                                  boxShadow: '0 2px 8px #f9731640'
                                }}
                              >
                                <span className="text-sm font-bold text-white">H</span>
                              </motion.div>
                              <motion.div
                                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg border border-blue-400 flex items-center justify-center shadow-md"
                                whileHover={{ scale: 1.1 }}
                                style={{
                                  boxShadow: '0 2px 8px #3b82f640'
                                }}
                              >
                                <span className="text-sm font-bold text-white">W</span>
                              </motion.div>
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