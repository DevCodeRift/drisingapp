'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Weapon } from '@/types/weapons';
import AdminNav from '@/components/AdminNav';

export default function AdminWeaponsPage() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weapons')
      .then(res => res.json())
      .then(data => {
        setWeapons(data.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading weapons:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/weapons/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setWeapons(weapons.filter(w => w.id !== id));
        alert('Weapon deleted successfully');
      } else {
        alert('Failed to delete weapon');
      }
    } catch (error) {
      console.error('Error deleting weapon:', error);
      alert('Error deleting weapon');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center">Loading weapons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Weapons</h1>
          <Link
            href="/admin/weapons/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Create New Weapon
          </Link>
        </div>

        {weapons.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">No weapons found</p>
            <Link
              href="/admin/weapons/new"
              className="text-blue-400 hover:text-blue-300"
            >
              Create your first weapon
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rarity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Element</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {weapons.map(weapon => (
                  <tr key={weapon.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      {weapon.imageUrl && (
                        <img
                          src={weapon.imageUrl}
                          alt={weapon.name}
                          className="w-12 h-12 object-contain"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{weapon.name}</td>
                    <td className="px-6 py-4 text-gray-300">{weapon.weaponType}</td>
                    <td className="px-6 py-4">
                      <span className="text-yellow-400">{'★'.repeat(weapon.rarity)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        weapon.element === 'Arc' ? 'bg-blue-900 text-blue-300' :
                        weapon.element === 'Solar' ? 'bg-orange-900 text-orange-300' :
                        weapon.element === 'Void' ? 'bg-purple-900 text-purple-300' :
                        'bg-gray-700'
                      }`}>
                        {weapon.element}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/weapons/${weapon.id}/edit`}
                          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(weapon.id, weapon.name)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
