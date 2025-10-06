'use client';

import { useRouter } from 'next/navigation';
import WeaponAdminForm from '@/components/WeaponAdminForm';
import { WeaponFormData } from '@/types/weapons';
import '@/components/WeaponAdminForm.css';

export default function NewWeaponPage() {
  const router = useRouter();

  const handleSubmit = async (data: WeaponFormData) => {
    const response = await fetch('/api/weapons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      alert('Weapon created successfully!');
      router.push('/admin/weapons');
    } else {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create weapon');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto">
        <WeaponAdminForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/weapons')}
        />
      </div>
    </div>
  );
}
