'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-destiny-darker text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-destiny-orange">Clan Recruitment</h1>
          {session && (
            <button
              onClick={() => router.push('/clans/create')}
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              Post Recruitment
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading clan posts...</div>
        ) : clanPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No clan recruitment posts. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6">
            {clanPosts.map((post) => (
              <div
                key={post.id}
                className={`bg-destiny-dark border rounded-lg p-6 transition ${
                  post.active
                    ? 'border-destiny-orange'
                    : 'border-gray-700 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-destiny-orange">
                      {post.clanName}
                    </h2>
                    {!post.active && (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        CLOSED
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="text-gray-300 mb-4 text-lg prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />

                {post.requirements && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-destiny-blue mb-2">
                      Requirements:
                    </h3>
                    <div
                      className="text-gray-400 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.requirements }}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-sm font-bold text-destiny-gold mb-2">
                    Contact:
                  </h3>
                  <p className="text-gray-300">{post.contactInfo}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Posted by {post.user.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {session?.user?.id === post.userId && post.active && (
                  <button
                    onClick={() => handleToggleActive(post.id, post.active)}
                    className="mt-4 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
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
