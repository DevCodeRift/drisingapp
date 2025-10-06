'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';

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

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  userId: string;
}

export default function NewsDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [news, setNews] = useState<NewsPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (newsId) {
      fetchNews();
      fetchComments();
    }
  }, [newsId]);

  const fetchNews = async () => {
    try {
      const res = await fetch(`/api/news?id=${newsId}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setNews(data[0]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?newsId=${newsId}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleUpvote = async () => {
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
        fetchNews();
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId, content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const hasUpvoted = () => {
    return session?.user?.id && news?.votes?.some(v => v.userId === session.user.id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-destiny-darker text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-destiny-darker text-white flex items-center justify-center">
        <p className="text-xl">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-destiny-darker text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/news')}
          className="text-destiny-blue hover:text-destiny-orange mb-6 transition"
        >
          ← Back to News
        </button>

        {/* News Header */}
        <div className="bg-destiny-dark border border-gray-700 rounded-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold uppercase ${getTypeColor(news.type)}`}>
                  {news.type}
                </span>
                {news.url && news.type === 'VIDEO' && (
                  <span className="text-xs text-gray-400">🎥</span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-destiny-orange mb-4">
                {news.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <span>by {news.user.name}</span>
                <span>{new Date(news.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={handleUpvote}
              className={`flex flex-col items-center px-6 py-3 rounded-lg transition ${
                hasUpvoted()
                  ? 'bg-destiny-orange text-white'
                  : 'bg-destiny-darker border border-gray-600 hover:border-destiny-orange'
              }`}
            >
              <span className="text-3xl">▲</span>
              <span className="text-xl font-bold">{news.voteCount || 0}</span>
            </button>
          </div>

          {/* News Content */}
          <div
            className="prose prose-invert max-w-none text-gray-300 mb-6"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-destiny-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              View {news.type === 'VIDEO' ? 'Video' : 'Content'} →
            </a>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-destiny-dark border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-destiny-orange mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {session ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder="Share your thoughts..."
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="mt-4 bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="text-gray-400 mb-8">
              <button
                onClick={() => router.push('/api/auth/signin')}
                className="text-destiny-blue hover:text-destiny-orange"
              >
                Sign in
              </button>{' '}
              to comment
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-destiny-darker border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      {comment.user.image && (
                        <img
                          src={comment.user.image}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-bold">{comment.user.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {session?.user?.id === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div
                    className="prose prose-invert max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
