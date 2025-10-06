'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

interface ModAttribute {
  id: number;
  name: string;
  statBonus?: string;
}

export default function AdminModAttributesPage() {
  const [attributes, setAttributes] = useState<ModAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    statBonus: ''
  });

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const res = await fetch('/api/mod-attributes');
      const data = await res.json();
      setAttributes(data.attributes || []);
    } catch (error) {
      console.error('Error loading attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/mod-attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttribute)
      });
      if (res.ok) {
        setNewAttribute({ name: '', statBonus: '' });
        loadAttributes();
        alert('Attribute created!');
      }
    } catch (error) {
      console.error('Error creating attribute:', error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete attribute "${name}"?`)) return;
    try {
      await fetch(`/api/mod-attributes/${id}`, { method: 'DELETE' });
      loadAttributes();
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-8 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Mod Attributes</h1>
        </div>

        {/* Create Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Attribute</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Attribute Name</label>
              <input
                type="text"
                required
                value={newAttribute.name}
                onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="e.g., Increased Damage"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Stat Bonus</label>
              <input
                type="text"
                value={newAttribute.statBonus}
                onChange={(e) => setNewAttribute({...newAttribute, statBonus: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="e.g., +15% damage"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
              Create Attribute
            </button>
          </form>
        </div>

        {/* Attributes List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Attribute Name</th>
                <th className="px-6 py-3 text-left">Stat Bonus</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {attributes.map(attr => (
                <tr key={attr.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium">{attr.name}</td>
                  <td className="px-6 py-4 text-sm text-green-400">{attr.statBonus}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(attr.id, attr.name)}
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
