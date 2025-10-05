'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function CreateClanPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    clanName: '',
    description: '',
    requirements: '',
    contactInfo: '',
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
      const res = await fetch('/api/clans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/clans');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create clan recruitment post');
      }
    } catch (error) {
      console.error('Error creating clan post:', error);
      alert('Failed to create clan recruitment post');
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
        <h1 className="text-4xl font-bold text-destiny-orange mb-8">
          Post Clan Recruitment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Clan Name</label>
            <input
              type="text"
              value={formData.clanName}
              onChange={(e) => setFormData({ ...formData, clanName: e.target.value })}
              required
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
              placeholder="Your clan name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              className="bg-white text-black rounded-lg"
              placeholder="Describe your clan, playstyle, goals, etc..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Requirements (optional)
            </label>
            <ReactQuill
              theme="snow"
              value={formData.requirements}
              onChange={(value) => setFormData({ ...formData, requirements: value })}
              className="bg-white text-black rounded-lg"
              placeholder="e.g., 18+, mic required, active 3+ days/week"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Info</label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              required
              className="w-full bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
              placeholder="Discord server, username, etc."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Post Recruitment'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/clans')}
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
