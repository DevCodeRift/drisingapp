'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { useTheme } from '@/contexts/ThemeContext';

interface Character {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface Build {
  id: string;
  title: string;
  description: string;
  content: string;
  voteCount: number;
  characterId: string;
  character: Character;
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

export default function BuildDetailPage() {
  const { data: session } = useSession();
  const { colors } = useTheme();
  const router = useRouter();
  const params = useParams();
  const buildId = params.id as string;

  const [build, setBuild] = useState<Build | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (buildId) {
      fetchBuild();
      fetchComments();
    }
  }, [buildId]);

  const fetchBuild = async () => {
    try {
      const res = await fetch(`/api/builds?id=${buildId}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setBuild(data[0]);
      }
    } catch (error) {
      console.error('Error fetching build:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?buildId=${buildId}`);
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
      const res = await fetch('/api/builds/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId }),
      });

      if (res.ok) {
        fetchBuild();
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
        body: JSON.stringify({ buildId, content: newComment }),
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
    return session?.user?.id && build?.votes?.some(v => v.userId === session.user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
        <p className="text-xl">Build not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/builds')}
          className="mb-6 transition"
          style={{ color: colors.primary }}
          onMouseOver={(e) => e.currentTarget.style.color = colors.accent}
          onMouseOut={(e) => e.currentTarget.style.color = colors.primary}
        >
          ← Back to Builds
        </button>

        {/* Build Header */}
        <div className="rounded-lg p-8 mb-6 border" style={{ backgroundColor: colors.surface, borderColor: colors.border.primary }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                {build.title}
              </h1>
              <div className="flex items-center gap-4 text-sm mb-4" style={{ color: colors.text.muted }}>
                <span className="text-lg" style={{ color: colors.accent }}>{build.character.name}</span>
                <span>by {build.user.name}</span>
                <span>{new Date(build.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-lg mb-6" style={{ color: colors.text.secondary }}>{build.description}</p>
            </div>

            <button
              onClick={handleUpvote}
              className="flex flex-col items-center px-6 py-3 rounded-lg transition border"
              style={{
                backgroundColor: hasUpvoted() ? colors.primary : colors.background,
                color: hasUpvoted() ? '#ffffff' : colors.text.primary,
                borderColor: hasUpvoted() ? colors.primary : colors.border.secondary
              }}
              onMouseOver={(e) => !hasUpvoted() && (e.currentTarget.style.borderColor = colors.primary)}
              onMouseOut={(e) => !hasUpvoted() && (e.currentTarget.style.borderColor = colors.border.secondary)}
            >
              <span className="text-3xl">▲</span>
              <span className="text-xl font-bold">{build.voteCount || 0}</span>
            </button>
          </div>

          {/* Build Content */}
          <div
            className="prose max-w-none"
            style={{ color: colors.text.secondary }}
            dangerouslySetInnerHTML={{ __html: build.content }}
          />
        </div>

        {/* Comments Section */}
        <div className="rounded-lg p-6 border" style={{ backgroundColor: colors.surface, borderColor: colors.border.primary }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>
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
                className="mt-4 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                style={{ backgroundColor: colors.primary }}
                onMouseOver={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = colors.accent)}
                onMouseOut={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="mb-8" style={{ color: colors.text.muted }}>
              <button
                onClick={() => router.push('/api/auth/signin')}
                className="transition"
                style={{ color: colors.primary }}
                onMouseOver={(e) => e.currentTarget.style.color = colors.accent}
                onMouseOut={(e) => e.currentTarget.style.color = colors.primary}
              >
                Sign in
              </button>{' '}
              to comment
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center py-8" style={{ color: colors.text.muted }}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: colors.background, borderColor: colors.border.primary }}
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
                        <p className="font-bold" style={{ color: colors.text.primary }}>{comment.user.name}</p>
                        <p className="text-xs" style={{ color: colors.text.muted }}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {session?.user?.id === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs transition"
                        style={{ color: '#ef4444' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#dc2626'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div
                    className="prose max-w-none"
                    style={{ color: colors.text.secondary }}
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
