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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.background }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-6"
        >
          <motion.div
            className="w-16 h-16 rounded-full border-4"
            style={{
              borderColor: colors.primary,
              borderTopColor: 'transparent'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span
            className="text-2xl font-bold"
            style={{
              color: colors.text.primary,
              textShadow: `2px 2px 4px rgba(0,0,0,0.5)`
            }}
          >
            🚀 Loading Destiny Rising... 🚀
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: colors.background }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Animated particles background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${colors.primary}, transparent)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Floating energy orbs */}
        <motion.div
          animate={{
            x: [0, 200, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }}
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 80, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-25"
          style={{ background: `radial-gradient(circle, ${colors.accent}, transparent)` }}
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${colors.secondary}, transparent)` }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <div
              className="inline-block px-8 py-4 rounded-full border-2 backdrop-blur-md shadow-2xl"
              style={{
                background: colors.surface,
                borderColor: colors.primary,
                boxShadow: `0 0 30px ${colors.primary}50`
              }}
            >
              <span
                className="font-bold tracking-widest uppercase text-lg"
                style={{ color: colors.primary }}
              >
                ⚡ DESTINY RISING ⚡
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-7xl md:text-9xl font-black mb-8 leading-none"
            style={{
              textShadow: `0 0 20px ${colors.primary}80`,
              color: colors.text.primary
            }}
          >
            <span
              className="block"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              COMMUNITY
            </span>
            <span
              className="block"
              style={{
                background: `linear-gradient(45deg, ${colors.accent}, ${colors.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              HUB
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <p
              className="text-2xl md:text-3xl mb-6 max-w-5xl mx-auto leading-relaxed font-semibold"
              style={{
                color: colors.text.primary,
                textShadow: `0 2px 4px rgba(0,0,0,0.3)`
              }}
            >
              🎯 Track Tasks • 🛠️ Share Builds • 👥 Find Teams • 🏆 Achieve Glory
            </p>
            <div
              className="w-32 h-1 mx-auto rounded-full"
              style={{ background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})` }}
            />
          </motion.div>

          {!session && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                variant="destiny"
                size="lg"
                className="text-xl px-12 py-6 rounded-full font-bold uppercase tracking-wider shadow-2xl"
                style={{
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                  boxShadow: `0 10px 30px ${colors.primary}40, 0 0 50px ${colors.primary}60`,
                  border: `2px solid ${colors.accent}`
                }}
                onClick={() => router.push('/api/auth/signin')}
              >
                🚀 JOIN THE COMMUNITY 🚀
              </Button>
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
          <h2
            className="text-5xl font-bold mb-6"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `0 0 30px ${colors.primary}50`
            }}
          >
            🔥 EXPLORE FEATURES 🔥
          </h2>
          <p
            className="text-xl font-semibold max-w-3xl mx-auto"
            style={{
              color: colors.text.primary,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Everything you need to dominate your Destiny Rising experience
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
                className="group p-8 h-full cursor-pointer backdrop-blur-md transition-all duration-300"
                style={{
                  background: colors.surface,
                  borderColor: colors.border.primary,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 20px ${colors.primary}20`
                }}
                onClick={() => router.push(item.href)}
              >
                <div className="text-center">
                  <motion.div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r ${item.color} mb-6 shadow-2xl`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{
                      color: colors.text.primary,
                      textShadow: `1px 1px 2px rgba(0,0,0,0.3)`
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="leading-relaxed font-medium"
                    style={{
                      color: colors.text.secondary,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    {item.description}
                  </p>
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
          <h2
            className="text-5xl font-bold mb-6"
            style={{
              background: `linear-gradient(45deg, ${colors.accent}, ${colors.primary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `0 0 30px ${colors.accent}50`
            }}
          >
            ⚡ RECENT ACTIVITY ⚡
          </h2>
          <p
            className="text-xl font-semibold"
            style={{
              color: colors.text.primary,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            See what&apos;s happening in the community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Builds */}
          <Card
            className="p-8 backdrop-blur-md border-2 shadow-2xl"
            style={{
              background: colors.surface,
              borderColor: colors.border.primary,
              boxShadow: `0 0 30px ${colors.primary}30`
            }}
          >
            <h3
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: colors.primary }}
            >
              🛠️ Latest Builds
            </h3>
            {activity.builds.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No builds yet</p>
            ) : (
              <div className="space-y-3">
                {activity.builds.map((build) => (
                  <motion.div
                    key={build.id}
                    onClick={() => router.push(`/builds/${build.id}`)}
                    className="p-4 rounded-xl cursor-pointer transition-all duration-200 border-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.surface}, ${colors.button.secondary})`,
                      borderColor: colors.border.primary,
                      boxShadow: `0 4px 15px rgba(0,0,0,0.1)`
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 8px 25px ${colors.primary}20`
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="font-bold text-lg mb-1"
                      style={{
                        color: colors.text.primary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {build.title}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{
                        color: colors.text.secondary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      🎯 {build.character.name} • by {build.user.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <Button
              onClick={() => router.push('/builds')}
              variant="destiny"
              size="md"
              className="mt-6 font-bold uppercase tracking-wider"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                boxShadow: `0 4px 15px ${colors.primary}40`
              }}
            >
              🔥 View All Builds 🔥
            </Button>
          </Card>

          {/* Recent News */}
          <Card
            className="p-8 backdrop-blur-md border-2 shadow-2xl"
            style={{
              background: colors.surface,
              borderColor: colors.border.primary,
              boxShadow: `0 0 30px ${colors.accent}30`
            }}
          >
            <h3
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: colors.accent }}
            >
              📰 Latest News
            </h3>
            {activity.news.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No news yet</p>
            ) : (
              <div className="space-y-3">
                {activity.news.map((post) => (
                  <motion.div
                    key={post.id}
                    onClick={() => router.push(`/news/${post.id}`)}
                    className="p-4 rounded-xl cursor-pointer transition-all duration-200 border-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.surface}, ${colors.button.secondary})`,
                      borderColor: colors.border.primary,
                      boxShadow: `0 4px 15px rgba(0,0,0,0.1)`
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 8px 25px ${colors.accent}20`
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="font-bold text-lg mb-1"
                      style={{
                        color: colors.text.primary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {post.title}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{
                        color: colors.text.secondary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      📰 {post.type} • by {post.user.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <Button
              onClick={() => router.push('/news')}
              variant="destiny"
              size="md"
              className="mt-6 font-bold uppercase tracking-wider"
              style={{
                background: `linear-gradient(45deg, ${colors.accent}, ${colors.primary})`,
                boxShadow: `0 4px 15px ${colors.accent}40`
              }}
            >
              📰 View All News 📰
            </Button>
          </Card>

          {/* Recent LFG */}
          <Card
            className="p-8 backdrop-blur-md border-2 shadow-2xl"
            style={{
              background: colors.surface,
              borderColor: colors.border.primary,
              boxShadow: `0 0 30px ${colors.primary}30`
            }}
          >
            <h3
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: colors.primary }}
            >
              👥 Active LFG
            </h3>
            {activity.lfg.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No active LFG posts</p>
            ) : (
              <div className="space-y-3">
                {activity.lfg.map((post) => (
                  <motion.div
                    key={post.id}
                    className="p-4 rounded-xl border-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.surface}, ${colors.button.secondary})`,
                      borderColor: colors.border.primary,
                      boxShadow: `0 4px 15px rgba(0,0,0,0.1)`
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 8px 25px ${colors.primary}20`
                    }}
                  >
                    <div
                      className="font-bold text-lg mb-1"
                      style={{
                        color: colors.text.primary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {post.activity}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{
                        color: colors.text.secondary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      👤 by {post.user.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <Button
              onClick={() => router.push('/lfg')}
              variant="destiny"
              size="md"
              className="mt-6 font-bold uppercase tracking-wider"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                boxShadow: `0 4px 15px ${colors.primary}40`
              }}
            >
              👥 View All LFG 👥
            </Button>
          </Card>

          {/* Recent Clans */}
          <Card
            className="p-8 backdrop-blur-md border-2 shadow-2xl"
            style={{
              background: colors.surface,
              borderColor: colors.border.primary,
              boxShadow: `0 0 30px ${colors.accent}30`
            }}
          >
            <h3
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: colors.accent }}
            >
              🏰 Recruiting Clans
            </h3>
            {activity.clans.length === 0 ? (
              <p style={{ color: colors.text.muted }}>No clan recruitment posts</p>
            ) : (
              <div className="space-y-3">
                {activity.clans.map((post) => (
                  <motion.div
                    key={post.id}
                    className="p-4 rounded-xl border-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.surface}, ${colors.button.secondary})`,
                      borderColor: colors.border.primary,
                      boxShadow: `0 4px 15px rgba(0,0,0,0.1)`
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `0 8px 25px ${colors.accent}20`
                    }}
                  >
                    <div
                      className="font-bold text-lg mb-1"
                      style={{
                        color: colors.text.primary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                    >
                      {post.clanName}
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{
                        color: colors.text.secondary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      👤 by {post.user.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            <Button
              onClick={() => router.push('/clans')}
              variant="destiny"
              size="md"
              className="mt-6 font-bold uppercase tracking-wider"
              style={{
                background: `linear-gradient(45deg, ${colors.accent}, ${colors.primary})`,
                boxShadow: `0 4px 15px ${colors.accent}40`
              }}
            >
              🏰 View All Clans 🏰
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
