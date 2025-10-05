'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

interface Character {
  id: string;
  name: string;
}

export default function CreateBuildPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    characterId: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }
    fetchCharacters();
  }, [session]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      setCharacters(data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/builds');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create build');
      }
    } catch (error) {
      console.error('Error creating build:', error);
      alert('Failed to create build');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-destiny-darker text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-destiny-orange mb-8">Create Build</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Character</label>
            <select
              value={formData.characterId}
              onChange={(e) => setFormData({ ...formData, characterId: e.target.value })}
              required
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Select a character</option>
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Build Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
              placeholder="e.g., Ultimate DPS Build"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
              placeholder="Brief summary of your build"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Build Details</label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Detailed build information, gear, skills, stats, etc..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Build'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/builds')}
              className="bg-destiny-dark hover:bg-gray-700 text-white px-6 py-2 rounded-lg border border-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
