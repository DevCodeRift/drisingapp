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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 bg-blue-100 border border-blue-300 rounded-full">
              <span className="text-blue-700 font-semibold tracking-wider uppercase text-sm">Destiny Rising</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Community Hub
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track tasks, share builds, find fireteams, and connect with the community
          </p>

          {!session && <LoginButton />}
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-8 py-12 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          <button
            onClick={() => router.push('/tasks')}
            className="group bg-white hover:bg-orange-50 border border-orange-200 hover:border-orange-400 p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-2">✓</div>
            <div className="font-bold text-orange-600">Tasks</div>
          </button>

          <button
            onClick={() => router.push('/builds')}
            className="group bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-400 p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-2">⚔️</div>
            <div className="font-bold text-blue-600">Builds</div>
          </button>

          <button
            onClick={() => router.push('/news')}
            className="group bg-white hover:bg-yellow-50 border border-yellow-200 hover:border-yellow-400 p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-2">📰</div>
            <div className="font-bold text-yellow-600">News</div>
          </button>

          <button
            onClick={() => router.push('/lfg')}
            className="group bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-400 p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold text-purple-600">LFG</div>
          </button>

          <button
            onClick={() => router.push('/clans')}
            className="group bg-white hover:bg-red-50 border border-red-200 hover:border-red-400 p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-bold text-red-400">Clans</div>
          </button>

          <button
            onClick={() => router.push('/achievements')}
            className="group bg-white hover:bg-green-50 border border-green-200 hover:border-green-400 p-6 rounded-lg transition shadow-sm hover:shadow-md min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-green-400">Achievements</div>
          </button>
        </div>

        {/* Recent Activity */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Activity</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Builds */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Latest Builds</h3>
            {activity.builds.length === 0 ? (
              <p className="text-gray-500">No builds yet</p>
            ) : (
              <div className="space-y-3">
                {activity.builds.map((build) => (
                  <div
                    key={build.id}
                    onClick={() => router.push(`/builds/${build.id}`)}
                    className="bg-gray-50 p-3 rounded cursor-pointer hover:bg-gray-100 transition border border-gray-200"
                  >
                    <div className="font-bold text-gray-900">{build.title}</div>
                    <div className="text-sm text-gray-600">
                      {build.character.name} • by {build.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/builds')}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm transition font-medium"
            >
              View all builds →
            </button>
          </div>

          {/* Recent News */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-yellow-600 mb-4">Latest News</h3>
            {activity.news.length === 0 ? (
              <p className="text-gray-500">No news yet</p>
            ) : (
              <div className="space-y-3">
                {activity.news.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/news/${post.id}`)}
                    className="bg-gray-50 p-3 rounded cursor-pointer hover:bg-gray-100 transition border border-gray-200"
                  >
                    <div className="font-bold text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-600">
                      {post.type} • by {post.user.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/news')}
              className="mt-4 text-yellow-600 hover:text-yellow-800 text-sm transition font-medium"
            >
              View all news →
            </button>
          </div>

          {/* Recent LFG */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Active LFG</h3>
            {activity.lfg.length === 0 ? (
              <p className="text-gray-500">No active LFG posts</p>
            ) : (
              <div className="space-y-3">
                {activity.lfg.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <div className="font-bold text-gray-900">{post.activity}</div>
                    <div className="text-sm text-gray-600">by {post.user.name}</div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/lfg')}
              className="mt-4 text-purple-600 hover:text-purple-800 text-sm transition font-medium"
            >
              View all LFG →
            </button>
          </div>

          {/* Recent Clans */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-red-600 mb-4">Recruiting Clans</h3>
            {activity.clans.length === 0 ? (
              <p className="text-gray-500">No clan recruitment posts</p>
            ) : (
              <div className="space-y-3">
                {activity.clans.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <div className="font-bold text-gray-900">{post.clanName}</div>
                    <div className="text-sm text-gray-600">by {post.user.name}</div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => router.push('/clans')}
              className="mt-4 text-red-600 hover:text-red-800 text-sm transition font-medium"
            >
              View all clans →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
