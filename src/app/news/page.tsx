'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  type: 'ARTICLE' | 'VIDEO' | 'GUIDE' | 'OTHER';
  url?: string;
  upvoteCount: number;
  user: {
    id: string;
    name: string;
    image: string;
  };
  upvotes: Array<{ userId: string }>;
  createdAt: string;
}

export default function NewsPage() {
  const { data: session } = useSession();
  const router = useRouter();
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
    return session?.user?.id && post.upvotes.some(u => u.userId === session.user.id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'text-red-400';
      case 'GUIDE':
        return 'text-destiny-gold';
      case 'ARTICLE':
        return 'text-destiny-blue';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-destiny-darker text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-destiny-orange">Destiny Rising News</h1>
          {session && (
            <button
              onClick={() => router.push('/news/create')}
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              Create Post
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
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
            className="bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            <option value="upvotes">Most Upvoted</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {/* News List */}
        {loading ? (
          <div className="text-center py-8">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No posts found. Be the first to create one!
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((post) => (
              <div
                key={post.id}
                className="bg-destiny-dark border border-gray-700 rounded-lg p-6 hover:border-destiny-orange transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold uppercase ${getTypeColor(post.type)}`}>
                        {post.type}
                      </span>
                      {post.url && post.type === 'VIDEO' && (
                        <span className="text-xs text-gray-400">🎥</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-destiny-orange mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span>by {post.user.name}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                    {post.url && (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-destiny-blue hover:text-destiny-orange transition"
                      >
                        View Content →
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${
                      hasUpvoted(post)
                        ? 'bg-destiny-orange text-white'
                        : 'bg-destiny-darker border border-gray-600 hover:border-destiny-orange'
                    }`}
                  >
                    <span className="text-2xl">▲</span>
                    <span className="text-lg font-bold">{post.upvoteCount}</span>
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
