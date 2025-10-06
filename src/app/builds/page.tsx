'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
    fetchBuilds();
  }, [selectedCharacter, sortBy]);

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
    <div className="min-h-screen bg-destiny-bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-destiny-orange">Character Builds</h1>
          {session && (
            <button
              onClick={() => router.push('/builds/create')}
              className="bg-destiny-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
            >
              Create Build
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="bg-destiny-bg-secondary text-destiny-text-primary px-4 py-2.5 rounded-md border border-destiny-border-subtle hover:border-destiny-border focus:border-destiny-orange focus:outline-none transition-all"
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
            className="bg-destiny-bg-secondary text-destiny-text-primary px-4 py-2.5 rounded-md border border-destiny-border-subtle hover:border-destiny-border focus:border-destiny-orange focus:outline-none transition-all"
          >
            <option value="upvotes">Most Upvoted</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {/* Builds List */}
        {loading ? (
          <div className="text-center py-8">Loading builds...</div>
        ) : builds.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No builds found. Be the first to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {builds.map((build) => (
              <div
                key={build.id}
                className="group bg-destiny-bg-secondary border border-destiny-border-subtle rounded-lg overflow-hidden hover:border-destiny-orange hover:shadow-destiny-card transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/builds/${build.id}`)}
              >
                {/* Character Image Background */}
                {build.character.imageUrl && (
                  <div className="relative h-32 bg-gradient-to-b from-destiny-bg-tertiary to-destiny-bg-secondary overflow-hidden">
                    <img
                      src={build.character.imageUrl}
                      alt={build.character.name}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-destiny-bg-secondary via-transparent"></div>
                  </div>
                )}

                <div className="p-5">
                  {/* Character Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-destiny-blue/20 text-destiny-blue rounded">
                      {build.character.name}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(build.id);
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition ${
                          hasUpvoted(build)
                            ? 'bg-destiny-orange text-white'
                            : 'bg-destiny-bg-tertiary text-destiny-text-secondary hover:text-destiny-orange'
                        }`}
                      >
                        <span>▲</span>
                        <span className="font-semibold">{build.voteCount || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-destiny-text-primary mb-2 group-hover:text-destiny-orange transition-colors line-clamp-2">
                    {build.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-destiny-text-secondary mb-3 line-clamp-2">
                    {build.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-destiny-text-muted">
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
