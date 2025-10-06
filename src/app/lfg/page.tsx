'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LFGPost {
  id: string;
  activity: string;
  description: string;
  playerCount: number;
  region?: string;
  active: boolean;
  userId: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  expiresAt?: string;
}

export default function LFGPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [lfgPosts, setLfgPosts] = useState<LFGPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLFG();
  }, []);

  const fetchLFG = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/lfg');
      const data = await res.json();
      setLfgPosts(data);
    } catch (error) {
      console.error('Error fetching LFG posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (postId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/lfg', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, active: !currentActive }),
      });

      if (res.ok) {
        fetchLFG();
      }
    } catch (error) {
      console.error('Error toggling post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-destiny-darker text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-destiny-orange">Looking For Group</h1>
          {session && (
            <button
              onClick={() => router.push('/lfg/create')}
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              Create LFG Post
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading LFG posts...</div>
        ) : lfgPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No active LFG posts. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {lfgPosts.map((post) => (
              <div
                key={post.id}
                className={`bg-destiny-dark border rounded-lg p-6 transition ${
                  post.active
                    ? 'border-destiny-orange'
                    : 'border-gray-700 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold text-destiny-orange">
                    {post.activity}
                  </h2>
                  {!post.active && (
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      CLOSED
                    </span>
                  )}
                </div>

                <div
                  className="text-gray-300 mb-4 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="text-destiny-blue">{post.playerCount} players needed</span>
                  {post.region && <span>Region: {post.region}</span>}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>Posted by {post.user.name}</span>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                {session?.user?.id === post.userId && post.active && (
                  <button
                    onClick={() => handleToggleActive(post.id, post.active)}
                    className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                  >
                    Mark as Closed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
