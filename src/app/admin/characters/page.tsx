'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';

interface Character {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function AdminCharactersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [bulkImporting, setBulkImporting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetchCharacters();
    }
  }, [status, router]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      setCharacters(data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCharacter),
      });

      if (res.ok) {
        setNewCharacter({ name: '', description: '', imageUrl: '' });
        fetchCharacters();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create character');
      }
    } catch (error) {
      console.error('Error creating character:', error);
      alert('Failed to create character');
    }
  };

  const handleBulkImport = async () => {
    if (!confirm('Import all characters from the public/characters folder? This will create 12 characters.')) {
      return;
    }

    setBulkImporting(true);

    try {
      const res = await fetch('/api/admin/seed-characters', {
        method: 'POST',
      });

      const result = await res.json();

      if (res.ok) {
        alert(`Successfully imported ${result.created} characters. Skipped ${result.skipped} duplicates.`);
        fetchCharacters();
      } else {
        alert(result.error || 'Failed to import characters');
      }
    } catch (error) {
      console.error('Error importing characters:', error);
      alert('Failed to import characters');
    } finally {
      setBulkImporting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-destiny-darker text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-destiny-darker text-white">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-8 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-destiny-orange">Manage Characters</h1>
          <div className="flex gap-4">
            <button
              onClick={handleBulkImport}
              disabled={bulkImporting}
              className="bg-destiny-purple hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {bulkImporting ? 'Importing...' : 'Bulk Import All'}
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="text-destiny-blue hover:text-destiny-orange transition"
            >
              ← Back to Admin
            </button>
          </div>
        </div>

        {/* Create New Character */}
        <div className="bg-destiny-dark border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-destiny-orange">Create New Character</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Character Name *</label>
              <input
                type="text"
                value={newCharacter.name}
                onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                required
                className="w-full bg-destiny-darker text-white px-4 py-2 rounded-lg border border-gray-700"
                placeholder="e.g., Nova, Titan, Shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newCharacter.description}
                onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                rows={3}
                className="w-full bg-destiny-darker text-white px-4 py-2 rounded-lg border border-gray-700"
                placeholder="Brief description of the character..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={newCharacter.imageUrl}
                onChange={(e) => setNewCharacter({ ...newCharacter, imageUrl: e.target.value })}
                className="w-full bg-destiny-darker text-white px-4 py-2 rounded-lg border border-gray-700"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <button
              type="submit"
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              Create Character
            </button>
          </form>
        </div>

        {/* Existing Characters */}
        <div className="bg-destiny-dark border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-destiny-orange">Existing Characters</h2>

          {loading ? (
            <p className="text-gray-400">Loading characters...</p>
          ) : characters.length === 0 ? (
            <p className="text-gray-400">No characters yet. Create one above!</p>
          ) : (
            <div className="space-y-4">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="bg-destiny-darker border border-gray-700 rounded-lg p-4 flex items-start gap-4"
                >
                  {char.imageUrl && (
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-destiny-blue">{char.name}</h3>
                    {char.description && (
                      <p className="text-gray-400 text-sm mt-1">{char.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
