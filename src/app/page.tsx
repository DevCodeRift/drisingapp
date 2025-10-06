'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/LoginButton';
import { useTheme } from '@/contexts/ThemeContext';

interface RecentActivity {
  builds: Array<{ id: string; title: string; character: { name: string }; user: { name: string }; createdAt: string }>;
  news: Array<{ id: string; title: string; type: string; user: { name: string }; createdAt: string }>;
  lfg: Array<{ id: string; activity: string; user: { name: string }; createdAt: string }>;
  clans: Array<{ id: string; clanName: string; user: { name: string }; createdAt: string }>;
}

export default function Home() {
  const { data: session, status } = useSession();
  const { colors } = useTheme();
  const router = useRouter();
  const [activity, setActivity] = useState<RecentActivity>({ builds: [], news: [], lfg: [], clans: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const [buildsRes, newsRes, lfgRes, clansRes] = await Promise.all([
        fetch('/api/builds?sortBy=recent').then(r => r.json()),
        fetch('/api/news?sortBy=recent').then(r => r.json()),
        fetch('/api/lfg').then(r => r.json()),
        fetch('/api/clans').then(r => r.json()),
      ]);

      setActivity({
        builds: buildsRes.slice(0, 5),
        news: newsRes.slice(0, 5),
        lfg: lfgRes.slice(0, 5),
        clans: clansRes.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primary }}></div>
          <span style={{ color: colors.text.secondary }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{
        background: `linear-gradient(to bottom right, ${colors.surface}, ${colors.background})`
      }}>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 rounded-full border" style={{
              backgroundColor: colors.primary + '20',
              borderColor: colors.primary + '40'
            }}>
              <span className="font-semibold tracking-wider uppercase text-sm" style={{ color: colors.primary }}>Destiny Rising</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent}, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Community Hub
          </h1>

          <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: colors.text.secondary }}>
            Track tasks, share builds, find fireteams, and connect with the community
          </p>

          {!session && <LoginButton />}
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-8 py-12" style={{ backgroundColor: colors.background }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          <button
            onClick={() => router.push('/tasks')}
            className="group p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent + '20';
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
              e.currentTarget.style.borderColor = colors.border.primary;
            }}
          >
            <div className="text-3xl mb-2">✓</div>
            <div className="font-bold" style={{ color: colors.accent }}>Tasks</div>
          </button>

          <button
            onClick={() => router.push('/builds')}
            className="group p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary + '20';
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
              e.currentTarget.style.borderColor = colors.border.primary;
            }}
          >
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-bold" style={{ color: colors.primary }}>Builds</div>
          </button>

          <button
            onClick={() => router.push('/news')}
            className="group p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#fbbf2420';
              e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
              e.currentTarget.style.borderColor = colors.border.primary;
            }}
          >
            <div className="text-3xl mb-2">📰</div>
            <div className="font-bold" style={{ color: '#fbbf24' }}>News</div>
          </button>

          <button
            onClick={() => router.push('/lfg')}
            className="group p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#a855f720';
              e.currentTarget.style.borderColor = '#a855f7';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
              e.currentTarget.style.borderColor = colors.border.primary;
            }}
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold" style={{ color: '#a855f7' }}>LFG</div>
          </button>

          <button
            onClick={() => router.push('/clans')}
            className="group p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc262620';
              e.currentTarget.style.borderColor = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
              e.currentTarget.style.borderColor = colors.border.primary;
            }}
          >
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-bold" style={{ color: '#dc2626' }}>Clans</div>
          </button>

          <button
            onClick={() => router.push('/achievements')}
            className="group p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border.primary
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#10b98120';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.surface;
              e.currentTarget.style.borderColor = colors.border.primary;
            }}
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold" style={{ color: '#10b981' }}>Achievements</div>
          </button>
        </div>

        {/* Recent Activity */}
        <h2 className="text-3xl font-bold mb-8" style={{ color: colors.text.primary }}>Recent Activity</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Builds */}
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: colors.surface, borderColor: colors.border.primary }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Latest Builds</h3>
            {activity.builds.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No builds yet</p>
            ) : (
              <div className="space-y-3">
                {activity.builds.map((build) => (
                  <div
                    key={build.id}
                    onClick={() => router.push(`/builds/${build.id}`)}
                    className="p-3 rounded cursor-pointer transition border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border.secondary
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.secondary}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.background}
                  >
                    <div className="font-bold" style={{ color: colors.text.primary }}>{build.title}</div>
                    <div className="text-sm" style={{ color: colors.text.secondary }}>
                      {build.character.name} • by {build.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/builds')}
              className="mt-4 text-sm transition font-medium"
              style={{ color: colors.primary }}
              onMouseOver={(e) => e.currentTarget.style.color = colors.accent}
              onMouseOut={(e) => e.currentTarget.style.color = colors.primary}
            >
              View all builds →
            </button>
          </div>

          {/* Recent News */}
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: colors.surface, borderColor: colors.border.primary }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#fbbf24' }}>Latest News</h3>
            {activity.news.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No news yet</p>
            ) : (
              <div className="space-y-3">
                {activity.news.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/news/${post.id}`)}
                    className="p-3 rounded cursor-pointer transition border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border.secondary
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.secondary}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.background}
                  >
                    <div className="font-bold" style={{ color: colors.text.primary }}>{post.title}</div>
                    <div className="text-sm" style={{ color: colors.text.secondary }}>
                      {post.type} • by {post.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/news')}
              className="mt-4 text-sm transition font-medium"
              style={{ color: '#fbbf24' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#f59e0b'}
              onMouseOut={(e) => e.currentTarget.style.color = '#fbbf24'}
            >
              View all news →
            </button>
          </div>

          {/* Recent LFG */}
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: colors.surface, borderColor: colors.border.primary }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#a855f7' }}>Active LFG</h3>
            {activity.lfg.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No active LFG posts</p>
            ) : (
              <div className="space-y-3">
                {activity.lfg.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border.secondary
                    }}
                  >
                    <div className="font-bold" style={{ color: colors.text.primary }}>{post.activity}</div>
                    <div className="text-sm" style={{ color: colors.text.secondary }}>by {post.user.name}</div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/lfg')}
              className="mt-4 text-sm transition font-medium"
              style={{ color: '#a855f7' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseOut={(e) => e.currentTarget.style.color = '#a855f7'}
            >
              View all LFG →
            </button>
          </div>

          {/* Recent Clans */}
          <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: colors.surface, borderColor: colors.border.primary }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#dc2626' }}>Recruiting Clans</h3>
            {activity.clans.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No clan recruitment posts</p>
            ) : (
              <div className="space-y-3">
                {activity.clans.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border.secondary
                    }}
                  >
                    <div className="font-bold" style={{ color: colors.text.primary }}>{post.clanName}</div>
                    <div className="text-sm" style={{ color: colors.text.secondary }}>by {post.user.name}</div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/clans')}
              className="mt-4 text-sm transition font-medium"
              style={{ color: '#dc2626' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'}
              onMouseOut={(e) => e.currentTarget.style.color = '#dc2626'}
            >
              View all clans →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
