'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginButton from '@/components/LoginButton';

interface RecentActivity {
  builds: Array<{ id: string; title: string; character: { name: string }; user: { name: string }; createdAt: string }>;
  news: Array<{ id: string; title: string; type: string; user: { name: string }; createdAt: string }>;
  lfg: Array<{ id: string; activity: string; user: { name: string }; createdAt: string }>;
  clans: Array<{ id: string; clanName: string; user: { name: string }; createdAt: string }>;
}

export default function Home() {
  const { data: session, status } = useSession();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destiny-darker via-destiny-dark to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-destiny-orange"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-destiny-darker via-destiny-dark to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-destiny-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-destiny-blue rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 bg-destiny-orange/10 border border-destiny-orange/30 rounded-full backdrop-blur-sm">
              <span className="text-destiny-orange font-semibold tracking-wider uppercase text-sm">Destiny Rising</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-destiny-orange via-destiny-gold to-destiny-orange bg-clip-text text-transparent">
            Community Hub
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Track tasks, share builds, find fireteams, and connect with the community
          </p>

          {!session && <LoginButton />}
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          <button
            onClick={() => router.push('/tasks')}
            className="group bg-destiny-dark/80 hover:bg-destiny-dark border border-destiny-orange/20 hover:border-destiny-orange p-6 rounded-lg transition"
          >
            <div className="text-3xl mb-2">✓</div>
            <div className="font-bold text-destiny-orange">Tasks</div>
          </button>

          <button
            onClick={() => router.push('/builds')}
            className="group bg-destiny-dark/80 hover:bg-destiny-dark border border-destiny-blue/20 hover:border-destiny-blue p-6 rounded-lg transition"
          >
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-bold text-destiny-blue">Builds</div>
          </button>

          <button
            onClick={() => router.push('/news')}
            className="group bg-destiny-dark/80 hover:bg-destiny-dark border border-destiny-gold/20 hover:border-destiny-gold p-6 rounded-lg transition"
          >
            <div className="text-3xl mb-2">📰</div>
            <div className="font-bold text-destiny-gold">News</div>
          </button>

          <button
            onClick={() => router.push('/lfg')}
            className="group bg-destiny-dark/80 hover:bg-destiny-dark border border-destiny-purple/20 hover:border-destiny-purple p-6 rounded-lg transition"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold text-destiny-purple">LFG</div>
          </button>

          <button
            onClick={() => router.push('/clans')}
            className="group bg-destiny-dark/80 hover:bg-destiny-dark border border-red-400/20 hover:border-red-400 p-6 rounded-lg transition"
          >
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-bold text-red-400">Clans</div>
          </button>

          <button
            onClick={() => router.push('/achievements')}
            className="group bg-destiny-dark/80 hover:bg-destiny-dark border border-green-400/20 hover:border-green-400 p-6 rounded-lg transition"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-green-400">Achievements</div>
          </button>
        </div>

        {/* Recent Activity */}
        <h2 className="text-3xl font-bold text-destiny-orange mb-8">Recent Activity</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Builds */}
          <div className="bg-destiny-dark border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-destiny-blue mb-4">Latest Builds</h3>
            {activity.builds.length === 0 ? (
              <p className="text-gray-400">No builds yet</p>
            ) : (
              <div className="space-y-3">
                {activity.builds.map((build) => (
                  <div
                    key={build.id}
                    onClick={() => router.push(`/builds/${build.id}`)}
                    className="bg-destiny-darker p-3 rounded cursor-pointer hover:bg-destiny-dark transition"
                  >
                    <div className="font-bold text-destiny-orange">{build.title}</div>
                    <div className="text-sm text-gray-400">
                      {build.character.name} • by {build.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/builds')}
              className="mt-4 text-destiny-blue hover:text-destiny-orange text-sm transition"
            >
              View all builds →
            </button>
          </div>

          {/* Recent News */}
          <div className="bg-destiny-dark border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-destiny-gold mb-4">Latest News</h3>
            {activity.news.length === 0 ? (
              <p className="text-gray-400">No news yet</p>
            ) : (
              <div className="space-y-3">
                {activity.news.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/news/${post.id}`)}
                    className="bg-destiny-darker p-3 rounded cursor-pointer hover:bg-destiny-dark transition"
                  >
                    <div className="font-bold text-destiny-orange">{post.title}</div>
                    <div className="text-sm text-gray-400">
                      {post.type} • by {post.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/news')}
              className="mt-4 text-destiny-gold hover:text-destiny-orange text-sm transition"
            >
              View all news →
            </button>
          </div>

          {/* Recent LFG */}
          <div className="bg-destiny-dark border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-destiny-purple mb-4">Active LFG</h3>
            {activity.lfg.length === 0 ? (
              <p className="text-gray-400">No active LFG posts</p>
            ) : (
              <div className="space-y-3">
                {activity.lfg.map((post) => (
                  <div
                    key={post.id}
                    className="bg-destiny-darker p-3 rounded"
                  >
                    <div className="font-bold text-destiny-orange">{post.activity}</div>
                    <div className="text-sm text-gray-400">by {post.user.name}</div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/lfg')}
              className="mt-4 text-destiny-purple hover:text-destiny-orange text-sm transition"
            >
              View all LFG →
            </button>
          </div>

          {/* Recent Clans */}
          <div className="bg-destiny-dark border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-400 mb-4">Recruiting Clans</h3>
            {activity.clans.length === 0 ? (
              <p className="text-gray-400">No clan recruitment posts</p>
            ) : (
              <div className="space-y-3">
                {activity.clans.map((post) => (
                  <div
                    key={post.id}
                    className="bg-destiny-darker p-3 rounded"
                  >
                    <div className="font-bold text-destiny-orange">{post.clanName}</div>
                    <div className="text-sm text-gray-400">by {post.user.name}</div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/clans')}
              className="mt-4 text-red-400 hover:text-destiny-orange text-sm transition"
            >
              View all clans →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
