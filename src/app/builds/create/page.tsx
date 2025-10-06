'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { useTheme } from '@/contexts/ThemeContext';

interface Character {
  id: string;
  name: string;
}

export default function CreateBuildPage() {
  const { data: session } = useSession();
  const { colors } = useTheme();
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
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ color: colors.primary }}>Create Build</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>Character</label>
            <select
              value={formData.characterId}
              onChange={(e) => setFormData({ ...formData, characterId: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border.primary
              }}
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
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>Build Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border.primary
              }}
              placeholder="e.g., Ultimate DPS Build"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>Short Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border.primary
              }}
              placeholder="Brief summary of your build"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>Build Details</label>
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
              className="text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              style={{
                backgroundColor: colors.primary
              }}
              onMouseOver={(e) => !submitting && (e.currentTarget.style.backgroundColor = colors.accent)}
              onMouseOut={(e) => !submitting && (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              {submitting ? 'Creating...' : 'Create Build'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/builds')}
              className="px-6 py-2 rounded-lg border transition"
              style={{
                backgroundColor: colors.surface,
                color: colors.text.primary,
                borderColor: colors.border.primary
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.secondary}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.surface}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
