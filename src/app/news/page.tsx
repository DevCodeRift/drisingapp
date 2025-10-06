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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Destiny Rising News</h1>
          {session && (
            <button
              onClick={() => router.push('/news/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
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
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 hover:border-blue-500 focus:border-blue-600 focus:outline-none transition-all"
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
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 hover:border-blue-500 focus:border-blue-600 focus:outline-none transition-all"
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
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer shadow-sm"
                onClick={() => router.push(`/news/${post.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getTypeColor(post.type)} bg-opacity-10`}>
                        {post.type}
                      </span>
                      {post.url && post.type === 'VIDEO' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">[VIDEO]</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>by {post.user.name}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(post.id);
                    }}
                    className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${
                      hasUpvoted(post)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
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
