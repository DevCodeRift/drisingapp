'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';
import ImageSelector from '@/components/ImageSelector';

interface Catalyst {
  id: number;
  name: string;
  description?: string;
  effect?: string;
  requirement?: string;
  iconUrl?: string;
}

export default function AdminCatalystsPage() {
  const [catalysts, setCatalysts] = useState<Catalyst[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatalyst, setNewCatalyst] = useState({
    name: '',
    description: '',
    effect: '',
    requirement: '',
    iconUrl: ''
  });

  useEffect(() => {
    loadCatalysts();
  }, []);

  const loadCatalysts = async () => {
    try {
      const res = await fetch('/api/catalysts');
      const data = await res.json();
      setCatalysts(data.catalysts || []);
    } catch (error) {
      console.error('Error loading catalysts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/catalysts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCatalyst)
      });
      if (res.ok) {
        setNewCatalyst({ name: '', description: '', effect: '', requirement: '', iconUrl: '' });
        loadCatalysts();
        alert('Catalyst created!');
      }
    } catch (error) {
      console.error('Error creating catalyst:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete catalyst "${name}"?`)) return;
    try {
      await fetch(`/api/catalysts/${id}`, { method: 'DELETE' });
      loadCatalysts();
    } catch (error) {
      console.error('Error deleting catalyst:', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-8 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Catalysts</h1>
        </div>

        {/* Create Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Catalyst</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Name</label>
              <input
                type="text"
                required
                value={newCatalyst.name}
                onChange={(e) => setNewCatalyst({...newCatalyst, name: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Effect</label>
              <input
                type="text"
                value={newCatalyst.effect}
                onChange={(e) => setNewCatalyst({...newCatalyst, effect: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="e.g., Increases damage by 25% and adds chain lightning"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Requirement</label>
              <input
                type="text"
                value={newCatalyst.requirement}
                onChange={(e) => setNewCatalyst({...newCatalyst, requirement: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="e.g., Complete 500 precision kills"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={newCatalyst.description}
                onChange={(e) => setNewCatalyst({...newCatalyst, description: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <ImageSelector
                label="Icon/Logo"
                value={newCatalyst.iconUrl || ''}
                onChange={(url) => setNewCatalyst({...newCatalyst, iconUrl: url})}
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
              Create Catalyst
            </button>
          </form>
        </div>

        {/* Catalysts List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Icon</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Effect</th>
                <th className="px-6 py-3 text-left">Requirement</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {catalysts.map(catalyst => (
                <tr key={catalyst.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    {catalyst.iconUrl && (
                      <img src={catalyst.iconUrl} alt={catalyst.name} className="w-10 h-10 rounded" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{catalyst.name}</td>
                  <td className="px-6 py-4 text-sm">{catalyst.effect}</td>
                  <td className="px-6 py-4 text-sm text-yellow-400">{catalyst.requirement}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{catalyst.description}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(catalyst.id, catalyst.name)}
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
