'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { useTheme } from '@/contexts/ThemeContext';
import { generateTableOfContents, addAnchorIds } from '@/lib/content-parser';

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
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [news, setNews] = useState<NewsPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

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

  // Generate table of contents from content
  const tableOfContents = useMemo(() => {
    if (!news?.content) return [];
    return generateTableOfContents(news.content);
  }, [news?.content]);

  // Add anchor IDs to content headings
  const enhancedContent = useMemo(() => {
    if (!news?.content) return '';
    return addAnchorIds(news.content);
  }, [news?.content]);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p className="text-xl" style={{ color: colors.text.primary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <p className="text-xl" style={{ color: colors.text.primary }}>Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/news')}
          className="flex items-center gap-2 mb-6 transition-colors hover:gap-3 duration-200"
          style={{ color: colors.primary }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to News
        </button>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents Sidebar */}
          {tableOfContents.length > 0 && (
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-8 rounded-xl border-2 p-6" style={{
                backgroundColor: colors.surface,
                borderColor: colors.border.primary
              }}>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.text.secondary }}>
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm transition-colors hover:translate-x-1 duration-200"
                      style={{
                        paddingLeft: `${(item.level - 2) * 1}rem`,
                        color: activeSection === item.id ? colors.primary : colors.text.secondary,
                        fontWeight: activeSection === item.id ? 600 : 400
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Article Header */}
            <div className="rounded-xl border-2 p-8 mb-6" style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}>
              <div className="flex justify-between items-start gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-lg ${getTypeColor(news.type)}`}>
                      {news.type}
                    </span>
                    {news.url && news.type === 'VIDEO' && (
                      <span className="text-xs px-3 py-1 rounded-lg" style={{
                        backgroundColor: colors.background,
                        color: colors.text.secondary
                      }}>VIDEO</span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
                    {news.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm" style={{ color: colors.text.secondary }}>
                    <span>by {news.user.name}</span>
                    <span>•</span>
                    <span>{new Date(news.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <button
                  onClick={handleUpvote}
                  className={`flex flex-col items-center px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex-shrink-0 ${
                    hasUpvoted()
                      ? 'bg-blue-600 text-white'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: hasUpvoted() ? colors.primary : colors.background,
                    borderWidth: hasUpvoted() ? '0' : '2px',
                    borderColor: hasUpvoted() ? 'transparent' : colors.border.primary,
                    color: hasUpvoted() ? '#ffffff' : colors.text.primary
                  }}
                >
                  <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-2xl font-bold">{news.voteCount || 0}</span>
                </button>
              </div>

              {/* Article Content */}
              <div
                className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20"
                style={{ color: colors.text.primary }}
                dangerouslySetInnerHTML={{ __html: enhancedContent }}
              />

              {news.url && (
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View {news.type === 'VIDEO' ? 'Video' : 'Content'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Comments Section */}
            <div className="rounded-xl border-2 p-6" style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.text.primary }}>
                <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Comments
                <span className="text-lg font-normal" style={{ color: colors.text.secondary }}>({comments.length})</span>
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
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-6 rounded-xl border-2 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                  <svg className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-lg mb-3" style={{ color: colors.text.primary }}>
                    Join the conversation
                  </p>
                  <button
                    onClick={() => router.push('/api/auth/signin')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    Sign in to comment
                  </button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-16">
                    <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.border.primary }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-xl font-semibold mb-2" style={{ color: colors.text.secondary }}>
                      No comments yet
                    </p>
                    <p style={{ color: colors.text.secondary, opacity: 0.7 }}>
                      Be the first to share your thoughts!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-xl p-5 border-2 transition-all hover:border-blue-500"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border.primary
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {comment.user.image ? (
                            <img
                              src={comment.user.image}
                              alt={comment.user.name}
                              className="w-10 h-10 rounded-full border-2 border-blue-500"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                              {comment.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold" style={{ color: colors.text.primary }}>{comment.user.name}</p>
                            <p className="text-xs" style={{ color: colors.text.secondary }}>
                              {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        {session?.user?.id === comment.userId && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                      <div
                        className="prose dark:prose-invert max-w-none prose-sm"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
