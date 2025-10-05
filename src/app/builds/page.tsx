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
  upvoteCount: number;
  characterId: string;
  character: Character;
  user: {
    id: string;
    name: string;
    image: string;
  };
  upvotes: Array<{ userId: string }>;
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
    return session?.user?.id && build.upvotes.some(u => u.userId === session.user.id);
  };

  return (
    <div className="min-h-screen bg-destiny-darker text-white p-8">
      <div className="max-w-7xl mx-auto">
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
        <div className="flex gap-4 mb-6">
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
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
            className="bg-destiny-dark text-white px-4 py-2 rounded-lg border border-gray-700"
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
          <div className="grid gap-6">
            {builds.map((build) => (
              <div
                key={build.id}
                className="bg-destiny-dark border border-gray-700 rounded-lg p-6 hover:border-destiny-orange transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-destiny-orange mb-2">
                      {build.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span className="text-destiny-blue">{build.character.name}</span>
                      <span>by {build.user.name}</span>
                      <span>{new Date(build.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300">{build.description}</p>
                  </div>

                  <button
                    onClick={() => handleUpvote(build.id)}
                    className={`flex flex-col items-center px-4 py-2 rounded-lg transition ${
                      hasUpvoted(build)
                        ? 'bg-destiny-orange text-white'
                        : 'bg-destiny-darker border border-gray-600 hover:border-destiny-orange'
                    }`}
                  >
                    <span className="text-2xl">▲</span>
                    <span className="text-lg font-bold">{build.upvoteCount}</span>
                  </button>
                </div>

                <div className="mt-4 text-gray-300 whitespace-pre-wrap">
                  {build.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
