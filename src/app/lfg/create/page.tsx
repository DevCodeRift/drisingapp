'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

export default function CreateLFGPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    activity: '',
    description: '',
    playerCount: 1,
    region: '',
    expiresInMinutes: 120, // default 2 hours
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
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
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
              Region (optional)
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Any Region</option>
              <option value="NA">NA (North America)</option>
              <option value="EMEA">EMEA (Europe, Middle East, Africa)</option>
              <option value="APAC">APAC (Asia Pacific)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Post Expires In
            </label>
            <select
              value={formData.expiresInMinutes}
              onChange={(e) => setFormData({ ...formData, expiresInMinutes: parseInt(e.target.value) })}
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
              <option value={480}>8 hours</option>
              <option value={1440}>24 hours</option>
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
