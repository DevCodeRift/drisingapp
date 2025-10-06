'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Zap, Gamepad2, Award } from 'lucide-react';
import LoginButton from '@/components/LoginButton';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <main className="min-h-screen overflow-hidden" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-orange-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

        {/* Floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-40 right-20 w-48 h-48 bg-orange-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8"
          >
            <div className="px-6 py-3 rounded-full border backdrop-blur-sm" style={{
              backgroundColor: colors.primary + '15',
              borderColor: colors.primary + '30'
            }}>
              <span className="font-semibold tracking-wider uppercase text-sm bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                Destiny Rising
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              Community
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-blue-600 bg-clip-text text-transparent">
              Hub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            Track tasks, share builds, find fireteams, and connect with the community in the ultimate Destiny experience
          </motion.p>

          {!session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <LoginButton />
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-8 py-16" style={{ backgroundColor: colors.background }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Explore Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to enhance your Destiny Rising experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Target,
              title: "Tasks",
              description: "Track daily, weekly, and seasonal objectives",
              color: "from-amber-500 to-orange-600",
              href: "/tasks"
            },
            {
              icon: Gamepad2,
              title: "Builds",
              description: "Share and discover powerful character builds",
              color: "from-blue-500 to-cyan-600",
              href: "/builds"
            },
            {
              icon: BookOpen,
              title: "News",
              description: "Stay updated with the latest community updates",
              color: "from-yellow-500 to-amber-600",
              href: "/news"
            },
            {
              icon: Users,
              title: "LFG",
              description: "Find fireteams for activities and raids",
              color: "from-purple-500 to-violet-600",
              href: "/lfg"
            },
            {
              icon: Zap,
              title: "Clans",
              description: "Join communities and make lasting connections",
              color: "from-red-500 to-rose-600",
              href: "/clans"
            },
            {
              icon: Award,
              title: "Achievements",
              description: "Unlock and showcase your accomplishments",
              color: "from-green-500 to-emerald-600",
              href: "/achievements"
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card
                hover
                glow
                className="group p-8 h-full cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
                onClick={() => router.push(item.href)}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Recent Activity
          </h2>
          <p className="text-lg text-gray-600">
            See what&apos;s happening in the community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Builds */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Latest Builds</h3>
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
            <Button
              onClick={() => router.push('/builds')}
              variant="ghost"
              size="sm"
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              View all builds →
            </Button>
          </Card>

          {/* Recent News */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
            <h3 className="text-xl font-bold mb-4 text-yellow-600">Latest News</h3>
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
            <Button
              onClick={() => router.push('/news')}
              variant="ghost"
              size="sm"
              className="mt-4 text-yellow-600 hover:text-yellow-700"
            >
              View all news →
            </Button>
          </Card>

          {/* Recent LFG */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
            <h3 className="text-xl font-bold mb-4 text-purple-600">Active LFG</h3>
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
            <Button
              onClick={() => router.push('/lfg')}
              variant="ghost"
              size="sm"
              className="mt-4 text-purple-600 hover:text-purple-700"
            >
              View all LFG →
            </Button>
          </Card>

          {/* Recent Clans */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/20">
            <h3 className="text-xl font-bold mb-4 text-red-600">Recruiting Clans</h3>
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
            <Button
              onClick={() => router.push('/clans')}
              variant="ghost"
              size="sm"
              className="mt-4 text-red-600 hover:text-red-700"
            >
              View all clans →
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
