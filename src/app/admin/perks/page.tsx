'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Perk {
  id: number;
  name: string;
  slot: number;
  description?: string;
  effect?: string;
}

export default function AdminPerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPerk, setNewPerk] = useState({
    name: '',
    slot: 3,
    description: '',
    effect: ''
  });

  useEffect(() => {
    loadPerks();
  }, []);

  const loadPerks = async () => {
    try {
      const res = await fetch('/api/perks');
      const data = await res.json();
      setPerks(data.perks || []);
    } catch (error) {
      console.error('Error loading perks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/perks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerk)
      });
      if (res.ok) {
        setNewPerk({ name: '', slot: 3, description: '', effect: '' });
        loadPerks();
        alert('Perk created!');
      }
    } catch (error) {
      console.error('Error creating perk:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete perk "${name}"?`)) return;
    try {
      await fetch(`/api/perks/${id}`, { method: 'DELETE' });
      loadPerks();
    } catch (error) {
      console.error('Error deleting perk:', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Perks</h1>
          <Link href="/admin/weapons" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
            ← Back to Weapons
          </Link>
        </div>

        {/* Create Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Perk</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={newPerk.name}
                  onChange={(e) => setNewPerk({...newPerk, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Slot</label>
                <select
                  value={newPerk.slot}
                  onChange={(e) => setNewPerk({...newPerk, slot: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value={3}>Slot 3 (Perk 1)</option>
                  <option value={4}>Slot 4 (Perk 2)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Effect</label>
              <input
                type="text"
                value={newPerk.effect}
                onChange={(e) => setNewPerk({...newPerk, effect: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="e.g., +30% rate of fire and damage for lower half of magazine"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={newPerk.description}
                onChange={(e) => setNewPerk({...newPerk, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                rows={3}
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
              Create Perk
            </button>
          </form>
        </div>

        {/* Perks List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Slot</th>
                <th className="px-6 py-3 text-left">Effect</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {perks.map(perk => (
                <tr key={perk.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium">{perk.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      perk.slot === 3 ? 'bg-green-900 text-green-300' : 'bg-cyan-900 text-cyan-300'
                    }`}>
                      Slot {perk.slot} ({perk.slot === 3 ? 'Perk 1' : 'Perk 2'})
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{perk.effect}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{perk.description}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(perk.id, perk.name)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
