'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { getCharacterImage } from '@/lib/image-assets';

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

export default function BuildsPage() {
  const { data: session } = useSession();
  const { colors } = useTheme();
  const router = useRouter();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  const [showPrivate, setShowPrivate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
    fetchBuilds();
  }, [selectedCharacter, sortBy, showPrivate]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch('/api/characters');
      const data = await res.json();
      setCharacters(data);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const fetchBuilds = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        ...(selectedCharacter && { characterId: selectedCharacter }),
        ...(showPrivate && session && { showPrivate: 'true' }),
      });
      const res = await fetch(`/api/builds?${params}`);
      const data = await res.json();
      setBuilds(data);
    } catch (error) {
      console.error('Error fetching builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (buildId: string) => {
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
        fetchBuilds(); // Refresh builds
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const hasUpvoted = (build: Build) => {
    return session?.user?.id && build.votes?.some(u => u.userId === session.user.id);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-2" style={{ color: colors.text.primary }}>
                Community Builds
              </h1>
              <p className="text-lg" style={{ color: colors.text.secondary }}>
                Discover and share powerful character builds
              </p>
            </div>
            {session && (
              <button
                onClick={() => router.push('/builds/create')}
                className="text-white px-8 py-3 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg min-h-[44px] flex items-center gap-2"
                style={{
                  backgroundColor: colors.primary
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Build
              </button>
            )}
          </div>

          {/* Filters */}
          <div
            className="flex gap-3 flex-wrap p-6 rounded-xl shadow-sm"
            style={{
              backgroundColor: colors.surface,
              borderLeft: `4px solid ${colors.primary}`
            }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: colors.text.secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-semibold" style={{ color: colors.text.secondary }}>Filters:</span>
            </div>

            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all min-h-[44px] font-medium"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
                focusRingColor: colors.primary
              }}
            >
              <option value="">All Characters</option>
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'upvotes' | 'recent')}
              className="px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all min-h-[44px] font-medium"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary
              }}
            >
              <option value="upvotes">Most Upvoted</option>
              <option value="recent">Most Recent</option>
            </select>

            {session && (
              <label
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all min-h-[44px] font-medium hover:shadow-sm"
                style={{
                  backgroundColor: showPrivate ? colors.primary + '10' : colors.background,
                  borderColor: showPrivate ? colors.primary : colors.border.primary
                }}
              >
                <input
                  type="checkbox"
                  checked={showPrivate}
                  onChange={(e) => setShowPrivate(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: colors.primary
                  }}
                />
                <span style={{ color: showPrivate ? colors.primary : colors.text.primary }}>My Builds Only</span>
              </label>
            )}
          </div>
        </div>

        {/* Builds List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
            <p className="mt-4 text-lg" style={{ color: colors.text.secondary }}>Loading builds...</p>
          </div>
        ) : builds.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
            <svg className="w-24 h-24 mx-auto mb-4" style={{ color: colors.text.muted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl font-semibold mb-2" style={{ color: colors.text.secondary }}>
              No builds found
            </p>
            <p style={{ color: colors.text.muted }}>
              Be the first to create one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <div
                key={build.id}
                className="group rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.border.primary}`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = colors.border.primary;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => router.push(`/builds/${build.id}`)}
              >
                {/* Character Image Header */}
                {build.character.name && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getCharacterImage(build.character.name) || ''}
                      alt={build.character.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{ objectPosition: 'center 20%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Character Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1.5 text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm"
                        style={{
                          backgroundColor: colors.primary + 'DD',
                          color: '#ffffff'
                        }}
                      >
                        {build.character.name}
                      </span>
                    </div>

                    {/* Upvote Button */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(build.id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                        style={{
                          backgroundColor: hasUpvoted(build) ? colors.primary : 'rgba(0,0,0,0.5)',
                          color: '#ffffff'
                        }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{build.voteCount || 0}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" style={{
                    color: colors.text.primary
                  }}>
                    {build.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm mb-4 line-clamp-3 leading-relaxed" style={{ color: colors.text.secondary }}>
                    {build.description || 'No description provided.'}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.border.secondary }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: colors.primary + '30', color: colors.primary }}>
                        {build.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                        {build.user.name}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: colors.text.muted }}>
                      {new Date(build.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
