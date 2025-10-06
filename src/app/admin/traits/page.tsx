'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Trait {
  id: number;
  name: string;
  type: string;
  description?: string;
  effect?: string;
}

export default function AdminTraitsPage() {
  const [traits, setTraits] = useState<Trait[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTrait, setNewTrait] = useState({
    name: '',
    type: 'intrinsic',
    description: '',
    effect: ''
  });

  useEffect(() => {
    loadTraits();
  }, []);

  const loadTraits = async () => {
    try {
      const res = await fetch('/api/traits');
      const data = await res.json();
      setTraits(data.traits || []);
    } catch (error) {
      console.error('Error loading traits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/traits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrait)
      });
      if (res.ok) {
        setNewTrait({ name: '', type: 'intrinsic', description: '', effect: '' });
        loadTraits();
        alert('Trait created!');
      }
    } catch (error) {
      console.error('Error creating trait:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete trait "${name}"?`)) return;
    try {
      await fetch(`/api/traits/${id}`, { method: 'DELETE' });
      loadTraits();
    } catch (error) {
      console.error('Error deleting trait:', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Traits</h1>
          <Link href="/admin/weapons" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
            ← Back to Weapons
          </Link>
        </div>

        {/* Create Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Trait</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={newTrait.name}
                  onChange={(e) => setNewTrait({...newTrait, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Type</label>
                <select
                  value={newTrait.type}
                  onChange={(e) => setNewTrait({...newTrait, type: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value="intrinsic">Intrinsic (Slot 1)</option>
                  <option value="origin">Origin (Slot 2)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Effect</label>
              <input
                type="text"
                value={newTrait.effect}
                onChange={(e) => setNewTrait({...newTrait, effect: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="e.g., +800 power to the weapon"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={newTrait.description}
                onChange={(e) => setNewTrait({...newTrait, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                rows={3}
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
              Create Trait
            </button>
          </form>
        </div>

        {/* Traits List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Effect</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {traits.map(trait => (
                <tr key={trait.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium">{trait.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      trait.type === 'intrinsic' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'
                    }`}>
                      {trait.type} (Slot {trait.type === 'intrinsic' ? '1' : '2'})
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{trait.effect}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{trait.description}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(trait.id, trait.name)}
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
