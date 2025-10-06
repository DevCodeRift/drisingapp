'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Weapon } from '@/types/weapons';
import { useTheme } from '@/contexts/ThemeContext';

export default function WeaponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { colors } = useTheme();
  const router = useRouter();
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);
  const [weaponId, setWeaponId] = useState<string>('');

  useEffect(() => {
    params.then(resolvedParams => {
      setWeaponId(resolvedParams.id);
      if (!resolvedParams.id) return;

      fetch(`/api/weapons/${resolvedParams.id}`)
        .then(res => res.json())
        .then((data: Weapon) => {
          setWeapon(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading weapon:', error);
          setLoading(false);
        });
    });
  }, [params]);

  const getRarityStars = (rarity: number) => {
    return '★'.repeat(rarity);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div style={{ color: colors.text.secondary }}>Loading weapon...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!weapon) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="mb-4 text-lg" style={{ color: colors.text.secondary }}>Weapon not found</div>
            <button
              onClick={() => router.push('/weapons')}
              className="px-6 py-3 font-medium rounded-md transition-colors min-h-[44px] inline-flex items-center border"
              style={{
                color: colors.primary,
                backgroundColor: colors.surface,
                borderColor: colors.border.primary
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.secondary}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.surface}
            >
              Back to Weapons Database
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/weapons')}
          className="flex items-center mb-6 transition-colors px-3 py-2 rounded-md border min-h-[44px]"
          style={{
            color: colors.primary,
            backgroundColor: 'transparent',
            borderColor: 'transparent'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = colors.surface;
            e.currentTarget.style.borderColor = colors.border.primary;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Weapons
        </button>

        <div className="rounded-lg border overflow-hidden" style={{
          backgroundColor: colors.surface,
          borderColor: colors.border.primary
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Image */}
            <div className="flex justify-center items-center rounded-lg p-8" style={{ backgroundColor: colors.background }}>
              {weapon.imageUrl ? (
                <img
                  src={weapon.imageUrl}
                  alt={weapon.name}
                  className="max-w-full max-h-80 object-contain"
                />
              ) : (
                <div className="w-48 h-48 rounded flex items-center justify-center" style={{ backgroundColor: colors.button.secondary }}>
                  <span style={{ color: colors.text.muted }}>No Image</span>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{
                  color: weapon.rarity === 6 ? '#fbbf24' :
                         weapon.rarity === 5 ? '#f97316' :
                         weapon.rarity === 4 ? '#a855f7' :
                         weapon.rarity === 3 ? '#3b82f6' : colors.text.primary
                }}>{weapon.name}</h1>
                <p className="text-xl" style={{ color: colors.text.secondary }}>{weapon.weaponType}</p>
              </div>

              {/* Key Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 rounded-lg border" style={{
                  backgroundColor: weapon.element === 'Arc' ? '#1e40af20' :
                                   weapon.element === 'Solar' ? '#ea580c20' :
                                   weapon.element === 'Void' ? '#7c3aed20' : colors.surface,
                  borderColor: weapon.element === 'Arc' ? '#3b82f6' :
                               weapon.element === 'Solar' ? '#ea580c' :
                               weapon.element === 'Void' ? '#7c3aed' : colors.border.primary,
                  color: weapon.element === 'Arc' ? '#60a5fa' :
                         weapon.element === 'Solar' ? '#fb923c' :
                         weapon.element === 'Void' ? '#a78bfa' : colors.text.primary
                }}>
                  <span className="font-medium">{weapon.element}</span>
                </div>
                <div className="px-4 py-2 rounded-lg border" style={{
                  backgroundColor: colors.button.secondary,
                  borderColor: colors.border.secondary
                }}>
                  <span className="font-medium" style={{ color: colors.text.primary }}>{weapon.slot}</span>
                </div>
                <div className="px-4 py-2 rounded-lg border" style={{
                  backgroundColor: weapon.rarity === 6 ? '#fbbf2420' :
                                   weapon.rarity === 5 ? '#f9731620' :
                                   weapon.rarity === 4 ? '#a855f720' :
                                   weapon.rarity === 3 ? '#3b82f620' : colors.surface,
                  borderColor: weapon.rarity === 6 ? '#fbbf24' :
                               weapon.rarity === 5 ? '#f97316' :
                               weapon.rarity === 4 ? '#a855f7' :
                               weapon.rarity === 3 ? '#3b82f6' : colors.border.primary,
                  color: weapon.rarity === 6 ? '#fbbf24' :
                         weapon.rarity === 5 ? '#f97316' :
                         weapon.rarity === 4 ? '#a855f7' :
                         weapon.rarity === 3 ? '#3b82f6' : colors.text.primary
                }}>
                  <span className="font-medium">
                    {getRarityStars(weapon.rarity)} ({weapon.rarity} Stars)
                  </span>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <div className="text-sm" style={{ color: colors.text.muted }}>Combat Style</div>
                  <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.combatStyle}</div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <div className="text-sm" style={{ color: colors.text.muted }}>Base Power</div>
                  <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.basePower}</div>
                </div>
              </div>

              {/* Weapon Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  {weapon.dps && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>DPS</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.dps}</div>
                    </div>
                  )}
                  {weapon.damage && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Damage</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.damage}</div>
                    </div>
                  )}
                  {weapon.range && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Range</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.range}</div>
                    </div>
                  )}
                  {weapon.stability && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Stability</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.stability}</div>
                    </div>
                  )}
                  {weapon.handling && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Handling</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.handling}</div>
                    </div>
                  )}
                  {weapon.reloadSpeed && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Reload Speed</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.reloadSpeed}</div>
                    </div>
                  )}
                  {weapon.magazineCap && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Magazine</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.magazineCap}</div>
                    </div>
                  )}
                  {weapon.maxAmmo && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Max Ammo</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.maxAmmo}</div>
                    </div>
                  )}
                  {weapon.rateOfFire && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Rate of Fire</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.rateOfFire}</div>
                    </div>
                  )}
                  {weapon.precisionBonus && (
                    <div className="p-3 rounded" style={{ backgroundColor: colors.background }}>
                      <div className="text-sm" style={{ color: colors.text.muted }}>Precision Bonus</div>
                      <div className="font-semibold" style={{ color: colors.text.primary }}>{weapon.precisionBonus}x</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}