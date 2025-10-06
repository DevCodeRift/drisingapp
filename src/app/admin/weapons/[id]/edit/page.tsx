'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import WeaponAdminForm from '@/components/WeaponAdminForm';
import { WeaponFormData, Weapon } from '@/types/weapons';
import '@/components/WeaponAdminForm.css';

export default function EditWeaponPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<WeaponFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weaponId, setWeaponId] = useState<string>('');

  useEffect(() => {
    params.then(resolvedParams => {
      setWeaponId(resolvedParams.id);

      if (!resolvedParams.id) return;

      fetch(`/api/weapons/${resolvedParams.id}`)
        .then(res => res.json())
        .then((weapon: Weapon) => {
          // Convert Weapon to WeaponFormData
          setInitialData({
            name: weapon.name,
            rarity: weapon.rarity,
            weaponType: weapon.weaponType,
            basePowerMin: weapon.basePowerMin,
            basePowerMax: weapon.basePowerMax,
            combatStyle: weapon.combatStyle,
            element: weapon.element,
            weaponSlot: weapon.weaponSlot,
            imageUrl: weapon.imageUrl,
            thumbnailUrl: weapon.thumbnailUrl,
            dps: weapon.dps,
            precisionBonus: weapon.precisionBonus,
            magazineCapacity: weapon.magazineCapacity,
            rateOfFire: weapon.rateOfFire,
            damage: weapon.damage,
            reloadSpeed: weapon.reloadSpeed,
            stability: weapon.stability,
            handling: weapon.handling,
            range: weapon.range,
            mods: weapon.mods || [],
            compatibleCharacterIds: weapon.compatibleCharacters?.map(c => c.id) || [],
            perks: weapon.perks || []
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading weapon:', error);
          alert('Failed to load weapon');
          router.push('/admin/weapons');
        });
    });
  }, [params, router]);

  const handleSubmit = async (data: WeaponFormData) => {
    const response = await fetch(`/api/weapons/${weaponId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Weapon updated successfully!');
      router.push('/admin/weapons');
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update weapon');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading weapon...</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Weapon not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto">
        <WeaponAdminForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/weapons')}
        />
      </div>
    </div>
  );
}
