'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  type: 'ARTICLE' | 'VIDEO' | 'GUIDE' | 'OTHER';
  url?: string;
  voteCount: number;
  user: {
    id: string;
    name: string;
    image: string;
  };
  votes: Array<{ userId: string }>;
  createdAt: string;
}

export default function NewsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { colors } = useTheme();
  const [news, setNews] = useState<NewsPost[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [selectedType, sortBy]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        ...(selectedType && { type: selectedType }),
      });
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (newsId: string) => {
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    try {
      const res = await fetch('/api/news/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId }),
      });

      if (res.ok) {
        fetchNews(); // Refresh news
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const hasUpvoted = (post: NewsPost) => {
    return session?.user?.id && post.votes?.some(u => u.userId === session.user.id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return '#f87171';
      case 'GUIDE':
        return '#fbbf24';
      case 'ARTICLE':
        return colors.primary;
      default:
        return colors.text.muted;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>Destiny Rising News</h1>
          {session && (
            <button
              onClick={() => router.push('/news/create')}
              className="px-6 py-2 rounded-lg transition"
              style={{
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.hover}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Create Post
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 rounded-md border focus:outline-none transition-all"
            style={{
              backgroundColor: colors.surface,
              color: colors.text.primary,
              borderColor: colors.border.primary
            }}
          >
            <option value="">All Types</option>
            <option value="ARTICLE">Articles</option>
            <option value="VIDEO">Videos</option>
            <option value="GUIDE">Guides</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'upvotes' | 'recent')}
            className="px-4 py-2.5 rounded-md border focus:outline-none transition-all"
            style={{
              backgroundColor: colors.surface,
              color: colors.text.primary,
              borderColor: colors.border.primary
            }}
          >
            <option value="upvotes">Most Upvoted</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {/* News List */}
        {loading ? (
          <div className="text-center py-8" style={{ color: colors.text.secondary }}>Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8" style={{ color: colors.text.muted }}>
            No posts found. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((post) => (
              <div
                key={post.id}
                className="rounded-lg p-6 transition cursor-pointer shadow-sm border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border.primary
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = colors.primary}
                onMouseOut={(e) => e.currentTarget.style.borderColor = colors.border.primary}
                onClick={() => router.push(`/news/${post.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-bold uppercase px-2 py-1 rounded"
                        style={{
                          color: getTypeColor(post.type),
                          backgroundColor: `${getTypeColor(post.type)}20`
                        }}
                      >
                        {post.type}
                      </span>
                      {post.url && post.type === 'VIDEO' && (
                        <span className="text-xs" style={{ color: colors.text.muted }}>[VIDEO]</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm" style={{ color: colors.text.secondary }}>
                      <span>by {post.user.name}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(post.id);
                    }}
                    className="flex flex-col items-center px-4 py-2 rounded-lg transition border"
                    style={{
                      backgroundColor: hasUpvoted(post) ? colors.primary : colors.button.secondary,
                      color: hasUpvoted(post) ? '#ffffff' : colors.text.primary,
                      borderColor: hasUpvoted(post) ? colors.primary : colors.border.primary
                    }}
                  >
                    <span className="text-2xl">▲</span>
                    <span className="text-lg font-bold">{post.voteCount || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
