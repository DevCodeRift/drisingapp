'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
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
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>Looking For Group</h1>
          {session && (
            <button
              onClick={() => router.push('/lfg/create')}
              className="px-6 py-2 rounded-lg transition"
              style={{
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.hover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Create LFG Post
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8" style={{ color: colors.text.secondary }}>Loading LFG posts...</div>
        ) : lfgPosts.length === 0 ? (
          <div className="text-center py-8" style={{ color: colors.text.muted }}>
            No active LFG posts. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {lfgPosts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-6 transition shadow-sm"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: post.active ? colors.primary : colors.border.secondary,
                  opacity: post.active ? 1 : 0.6
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                    {post.activity}
                  </h2>
                  {!post.active && (
                    <span
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{
                        backgroundColor: colors.button.secondary,
                        color: colors.text.secondary
                      }}
                    >
                      CLOSED
                    </span>
                  )}
                </div>

                <div
                  className="mb-4 prose prose-sm max-w-none"
                  style={{ color: colors.text.secondary }}
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />

                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: colors.text.secondary }}>
                  <span className="font-medium" style={{ color: colors.primary }}>{post.playerCount} players needed</span>
                  {post.region && <span>Region: {post.region}</span>}
                </div>

                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: colors.text.secondary }}>
                  <span>Posted by {post.user.name}</span>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                {session?.user?.id === post.userId && post.active && (
                  <button
                    onClick={() => handleToggleActive(post.id, post.active)}
                    className="mt-2 text-sm px-4 py-1 rounded transition"
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
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
