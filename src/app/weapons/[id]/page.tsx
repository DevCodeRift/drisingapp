'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Weapon } from '@/types/weapons';

export default function WeaponDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Arc': return 'text-blue-400 bg-blue-900/20 border-blue-300';
      case 'Solar': return 'text-orange-400 bg-orange-900/20 border-orange-300';
      case 'Void': return 'text-purple-400 bg-purple-900/20 border-purple-300';
      default: return 'text-gray-400 bg-gray-700/20 border-gray-300';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400">Loading weapon...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!weapon) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4 text-lg">Weapon not found</div>
            <button
              onClick={() => router.push('/weapons')}
              className="px-6 py-3 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors min-h-[44px] inline-flex items-center"
            >
              Back to Weapons Database
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/weapons')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors px-3 py-2 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-200 min-h-[44px]"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Weapons
        </button>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Image */}
            <div className="flex justify-center items-center bg-gray-700 rounded-lg p-8">
              {weapon.imageUrl ? (
                <img
                  src={weapon.imageUrl}
                  alt={weapon.name}
                  className="max-w-full max-h-80 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${getRarityColors(weapon.rarity).text}`}>{weapon.name}</h1>
                <p className="text-xl text-gray-400">{weapon.weaponType}</p>
              </div>

              {/* Key Stats */}
              <div className="flex flex-wrap gap-4">
                <div className={`px-4 py-2 rounded-lg border ${getElementColor(weapon.element)}`}>
                  <span className="font-medium">{weapon.element}</span>
                </div>
                <div className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600">
                  <span className="text-gray-300 font-medium">{weapon.slot}</span>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${getRarityColors(weapon.rarity).bg} ${getRarityColors(weapon.rarity).border}`}>
                  <span className={`font-medium ${getRarityColors(weapon.rarity).text}`}>
                    {getRarityStars(weapon.rarity)} ({weapon.rarity} Stars)
                  </span>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Combat Style</div>
                  <div className="font-semibold text-gray-200">{weapon.combatStyle}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Base Power</div>
                  <div className="font-semibold text-gray-200">{weapon.basePower}</div>
                </div>
              </div>

              {/* Weapon Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  {weapon.dps && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">DPS</div>
                      <div className="font-semibold text-gray-200">{weapon.dps}</div>
                    </div>
                  )}
                  {weapon.damage && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Damage</div>
                      <div className="font-semibold text-gray-200">{weapon.damage}</div>
                    </div>
                  )}
                  {weapon.range && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Range</div>
                      <div className="font-semibold text-gray-200">{weapon.range}</div>
                    </div>
                  )}
                  {weapon.stability && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Stability</div>
                      <div className="font-semibold text-gray-200">{weapon.stability}</div>
                    </div>
                  )}
                  {weapon.handling && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Handling</div>
                      <div className="font-semibold text-gray-200">{weapon.handling}</div>
                    </div>
                  )}
                  {weapon.reloadSpeed && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Reload Speed</div>
                      <div className="font-semibold text-gray-200">{weapon.reloadSpeed}</div>
                    </div>
                  )}
                  {weapon.magazineCap && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Magazine</div>
                      <div className="font-semibold text-gray-200">{weapon.magazineCap}</div>
                    </div>
                  )}
                  {weapon.maxAmmo && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Max Ammo</div>
                      <div className="font-semibold text-gray-200">{weapon.maxAmmo}</div>
                    </div>
                  )}
                  {weapon.rateOfFire && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Rate of Fire</div>
                      <div className="font-semibold text-gray-200">{weapon.rateOfFire}</div>
                    </div>
                  )}
                  {weapon.precisionBonus && (
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-400">Precision Bonus</div>
                      <div className="font-semibold text-gray-200">{weapon.precisionBonus}x</div>
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