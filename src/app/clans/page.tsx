'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

interface ClanPost {
  id: string;
  clanName: string;
  description: string;
  requirements?: string;
  contactInfo: string;
  active: boolean;
  userId: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
}

export default function ClansPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { colors } = useTheme();
  const [clanPosts, setClanPosts] = useState<ClanPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClans();
  }, []);

  const fetchClans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clans');
      const data = await res.json();
      setClanPosts(data);
    } catch (error) {
      console.error('Error fetching clan posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (postId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/clans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, active: !currentActive }),
      });

      if (res.ok) {
        fetchClans();
      }
    } catch (error) {
      console.error('Error toggling post:', error);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>Clan Recruitment</h1>
          {session && (
            <button
              onClick={() => router.push('/clans/create')}
              className="px-6 py-2 rounded-lg transition"
              style={{
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.hover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Post Recruitment
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8" style={{ color: colors.text.secondary }}>Loading clan posts...</div>
        ) : clanPosts.length === 0 ? (
          <div className="text-center py-8" style={{ color: colors.text.muted }}>
            No clan recruitment posts. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6">
            {clanPosts.map((post) => (
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
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold" style={{ color: colors.text.primary }}>
                      {post.clanName}
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
                </div>

                <div
                  className="mb-4 text-lg prose prose-sm max-w-none"
                  style={{ color: colors.text.secondary }}
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />

                {post.requirements && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold mb-2" style={{ color: colors.primary }}>
                      Requirements:
                    </h3>
                    <div
                      className="prose prose-sm max-w-none"
                      style={{ color: colors.text.secondary }}
                      dangerouslySetInnerHTML={{ __html: post.requirements }}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-sm font-bold mb-2" style={{ color: colors.accent }}>
                    Contact:
                  </h3>
                  <p style={{ color: colors.text.secondary }}>{post.contactInfo}</p>
                </div>

                <div className="flex items-center gap-4 text-sm" style={{ color: colors.text.secondary }}>
                  <span>Posted by {post.user.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {session?.user?.id === post.userId && post.active && (
                  <button
                    onClick={() => handleToggleActive(post.id, post.active)}
                    className="mt-4 text-sm px-4 py-2 rounded transition"
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                  >
                    Close Recruitment
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
