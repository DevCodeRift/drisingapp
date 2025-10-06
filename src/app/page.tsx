'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Zap, Gamepad2, Award, ArrowRight } from 'lucide-react';
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primary }}></div>
          <span style={{ color: colors.text.secondary }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <div className="relative py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{
                backgroundColor: colors.button.secondary,
                color: colors.primary
              }}
            >
              DESTINY RISING
            </span>
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ color: colors.text.primary }}
            >
              Community Hub
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              Track tasks, share builds, find teams, and achieve glory in Destiny Rising
            </p>
          </motion.div>

          {!session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="text-lg px-8 py-4 rounded-lg font-semibold"
                onClick={() => router.push('/api/auth/signin')}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content - Features and Recent Activity */}
      <div className="py-16 px-8" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Features - Left Side (2/3 width) */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Features
                </h2>
                <p
                  className="text-lg"
                  style={{ color: colors.text.secondary }}
                >
                  Everything you need to enhance your Destiny Rising experience
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                title: "Tasks",
                description: "Track daily, weekly, and seasonal objectives",
                href: "/tasks"
              },
              {
                icon: Gamepad2,
                title: "Builds",
                description: "Share and discover powerful character builds",
                href: "/builds"
              },
              {
                icon: BookOpen,
                title: "News",
                description: "Stay updated with the latest community updates",
                href: "/news"
              },
              {
                icon: Users,
                title: "LFG",
                description: "Find fireteams for activities and raids",
                href: "/lfg"
              },
              {
                icon: Zap,
                title: "Clans",
                description: "Join communities and make lasting connections",
                href: "/clans"
              },
              {
                icon: Award,
                title: "Achievements",
                description: "Unlock and showcase your accomplishments",
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
                  className="p-6 h-full cursor-pointer border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border.primary
                  }}
                  onClick={() => router.push(item.href)}
                >
                  <div className="text-center">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                      style={{ backgroundColor: colors.button.secondary }}
                    >
                      <item.icon className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                      {item.title}
                    </h3>
                    <p style={{ color: colors.text.secondary }}>
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity - Right Sidebar */}
        <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Recent Activity
          </h2>
          <p
            className="text-lg"
            style={{ color: colors.text.secondary }}
          >
            Community updates
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Recent Builds */}
          <Card
            className="p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border.primary
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text.primary }}
            >
              Latest Builds
            </h3>
            {activity.builds.length === 0 ? (
              <p className="text-sm" style={{ color: colors.text.muted }}>No builds yet</p>
            ) : (
              <div className="space-y-3">
                {activity.builds.slice(0, 3).map((build) => (
                  <div
                    key={build.id}
                    onClick={() => router.push(`/builds/${build.id}`)}
                    className="p-3 rounded-lg cursor-pointer transition-colors border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border.secondary
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.secondary}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.surface}
                  >
                    <div className="font-medium text-sm" style={{ color: colors.text.primary }}>{build.title}</div>
                    <div className="text-xs" style={{ color: colors.text.secondary }}>
                      {build.character.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={() => router.push('/builds')}
              variant="ghost"
              size="sm"
              className="mt-4 text-sm"
              style={{ color: colors.primary }}
            >
              View all →
            </Button>
          </Card>

          {/* Recent News */}
          <Card
            className="p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border.primary
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text.primary }}
            >
              Latest News
            </h3>
            {activity.news.length === 0 ? (
              <p className="text-sm" style={{ color: colors.text.muted }}>No news yet</p>
            ) : (
              <div className="space-y-3">
                {activity.news.slice(0, 3).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/news/${post.id}`)}
                    className="p-3 rounded-lg cursor-pointer transition-colors border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border.secondary
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.secondary}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.surface}
                  >
                    <div className="font-medium text-sm" style={{ color: colors.text.primary }}>{post.title}</div>
                    <div className="text-xs" style={{ color: colors.text.secondary }}>
                      {post.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={() => router.push('/news')}
              variant="ghost"
              size="sm"
              className="mt-4 text-sm"
              style={{ color: colors.primary }}
            >
              View all →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  </div>
</div>
    </main>
  );
}