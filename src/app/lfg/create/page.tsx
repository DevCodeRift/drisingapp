'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateLFGPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    activity: '',
    description: '',
    playerCount: 1,
    platform: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/api/auth/signin');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/lfg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/lfg');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create LFG post');
      }
    } catch (error) {
      console.error('Error creating LFG post:', error);
      alert('Failed to create LFG post');
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
        <h1 className="text-4xl font-bold text-destiny-orange mb-8">Create LFG Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Activity</label>
            <input
              type="text"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              required
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
              placeholder="e.g., Nightfall Strike, Raid, PvP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
              placeholder="Describe what you're looking for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Players Needed</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.playerCount}
              onChange={(e) => setFormData({ ...formData, playerCount: parseInt(e.target.value) })}
              required
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Platform (optional)
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Any Platform</option>
              <option value="PC">PC</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/lfg')}
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
