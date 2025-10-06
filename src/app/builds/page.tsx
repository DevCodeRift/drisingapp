'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>Character Builds</h1>
          {session && (
            <button
              onClick={() => router.push('/builds/create')}
              className="text-white px-6 py-2 rounded-lg transition min-h-[44px] flex items-center"
              style={{
                backgroundColor: colors.primary
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.accent}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Create Build
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="px-4 py-2.5 rounded-md border focus:outline-none transition-all min-h-[44px]"
            style={{
              backgroundColor: colors.surface,
              color: colors.text.primary,
              borderColor: colors.border.primary
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
            className="px-4 py-2.5 rounded-md border focus:outline-none transition-all min-h-[44px]"
            style={{
              backgroundColor: colors.surface,
              color: colors.text.primary,
              borderColor: colors.border.primary
            }}
          >
            <option value="upvotes">Most Upvoted</option>
            <option value="recent">Most Recent</option>
          </select>

          {session && (
            <label
              className="flex items-center gap-2 px-4 py-2.5 rounded-md border cursor-pointer transition-all min-h-[44px]"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border.primary
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
              <span style={{ color: colors.text.primary }}>My Builds Only</span>
            </label>
          )}
        </div>

        {/* Builds List */}
        {loading ? (
          <div className="text-center py-8" style={{ color: colors.text.secondary }}>Loading builds...</div>
        ) : builds.length === 0 ? (
          <div className="text-center py-8" style={{ color: colors.text.secondary }}>
            No builds found. Be the first to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {builds.map((build) => (
              <div
                key={build.id}
                className="group rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border.primary
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = colors.primary}
                onMouseOut={(e) => e.currentTarget.style.borderColor = colors.border.primary}
                onClick={() => router.push(`/builds/${build.id}`)}
              >
                {/* Character Image Background */}
                {build.character.imageUrl && (
                  <div className="relative h-32 overflow-hidden" style={{
                    background: `linear-gradient(to bottom, ${colors.surface}, ${colors.background})`
                  }}>
                    <img
                      src={build.character.imageUrl}
                      alt={build.character.name}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute inset-0" style={{
                      background: `linear-gradient(to top, ${colors.surface}, transparent)`
                    }}></div>
                  </div>
                )}

                <div className="p-5">
                  {/* Character Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2 py-1 text-xs font-semibold rounded border"
                      style={{
                        backgroundColor: colors.primary + '20',
                        color: colors.primary,
                        borderColor: colors.primary + '40'
                      }}
                    >
                      {build.character.name}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(build.id);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded text-sm transition"
                        style={{
                          backgroundColor: hasUpvoted(build) ? colors.primary : colors.surface,
                          color: hasUpvoted(build) ? '#ffffff' : colors.text.secondary,
                          border: `1px solid ${hasUpvoted(build) ? colors.primary : colors.border.secondary}`
                        }}
                      >
                        <span>▲</span>
                        <span className="font-semibold">{build.voteCount || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 transition-colors line-clamp-2" style={{
                    color: colors.text.primary
                  }}>
                    {build.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.text.secondary }}>
                    {build.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs" style={{ color: colors.text.muted }}>
                    <span>by {build.user.name}</span>
                    <span>{new Date(build.createdAt).toLocaleDateString()}</span>
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
