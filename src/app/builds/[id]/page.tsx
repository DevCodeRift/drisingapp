'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { getCharacterImage } from '@/lib/image-assets';
import { getArtifactImagePath, formatArtifactName, type ArtifactSlot } from '@/lib/artifact-assets';

interface Character {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface Artifact {
  id: string;
  slot: number;
  artifactName: string;
  rarity: string;
  power: number;
  gearLevel: number;
  enhancementLevel: number;
  attributes: {
    id: string;
    name: string;
    description: string | null;
  }[];
}

interface Weapon {
  id: string;
  slot: string;
  customName: string | null;
  gearLevel: number;
  enhancementLevel: number;
  weapon: {
    id: string;
    name: string;
    imageUrl: string | null;
    weaponType: string;
    element: string;
    rarity: number;
  } | null;
  traits: {
    id: string;
    name: string;
    description: string | null;
    effect: string | null;
  }[];
  perks: {
    id: string;
    name: string;
    description: string | null;
    effect: string | null;
  }[];
  catalysts: {
    id: string;
    name: string;
    description: string | null;
    effect: string | null;
  }[];
  mods: {
    id: string;
    name: string;
    description: string | null;
    effect: string | null;
  }[];
}

interface Build {
  id: string;
  title: string;
  description: string;
  content: string;
  voteCount: number;
  characterId: string;
  isPublic: boolean;
  character: Character;
  user: {
    id: string;
    name: string;
    image: string;
  };
  votes: Array<{ userId: string }>;
  createdAt: string;
  artifacts: Artifact[];
  weapons: Weapon[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  userId: string;
}

export default function BuildDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const buildId = params.id as string;

  const [build, setBuild] = useState<Build | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (buildId) {
      fetchBuild();
      fetchComments();
    }
  }, [buildId]);

  const fetchBuild = async () => {
    try {
      const res = await fetch(`/api/builds/${buildId}`);
      const data = await res.json();
      setBuild(data);
    } catch (error) {
      console.error('Error fetching build:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?buildId=${buildId}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleUpvote = async () => {
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
        fetchBuild();
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId, content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const hasUpvoted = () => {
    return session?.user?.id && build?.votes?.some(v => v.userId === session.user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-white text-xl">Loading build...</p>
        </div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-900 dark:text-white text-xl">Build not found</p>
      </div>
    );
  }

  const primaryWeapon = build.weapons.find(w => w.slot === 'Primary');
  const powerWeapon = build.weapons.find(w => w.slot === 'Power');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section with Character */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <img
          src={getCharacterImage(build.character.name) || ''}
          alt={build.character.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          style={{ objectPosition: 'center 20%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <button
            onClick={() => router.push('/builds')}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Builds
          </button>

          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg">
                  {build.character.name}
                </span>
                {!build.isPublic && (
                  <span className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-bold rounded-lg shadow-lg">
                    Private
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">{build.title}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-bold">
                    {build.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{build.user.name}</span>
                </div>
                <span>•</span>
                <span>{new Date(build.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {session?.user?.id === build.user.id && (
                <button
                  onClick={() => router.push(`/builds/${build.id}/edit`)}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg transition-all bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/30 font-semibold shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Build
                </button>
              )}
              <button
                onClick={handleUpvote}
                className={`flex flex-col items-center justify-center px-6 py-3 rounded-lg transition-all font-bold shadow-lg min-w-[100px] ${
                  hasUpvoted()
                    ? 'bg-blue-600 text-white border-2 border-blue-400'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-2 border-white/30'
                }`}
              >
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-2xl">{build.voteCount || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        {build.description && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-md border-l-4 border-blue-600">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Build Description</h3>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{build.description}</p>
          </div>
        )}

        {/* Artifacts Section */}
        {build.artifacts && build.artifacts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded"></div>
              Artifacts
              <span className="text-base font-normal text-gray-500 dark:text-gray-400">({build.artifacts.length}/4)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {build.artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
                >
                  <div className="flex items-start gap-5">
                    {artifact.artifactName && (
                      <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-3 border-2 border-gray-200 dark:border-gray-600">
                        <img
                          src={getArtifactImagePath(artifact.slot as ArtifactSlot, artifact.artifactName)}
                          alt={formatArtifactName(artifact.artifactName)}
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">
                          Slot {artifact.slot}
                        </span>
                        <span className={`text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm ${
                          artifact.rarity === 'Exotic' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                          artifact.rarity === 'Mythic' ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white' :
                          'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {artifact.rarity}
                        </span>
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">
                        {artifact.artifactName ? formatArtifactName(artifact.artifactName) : `Artifact ${artifact.slot}`}
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 7H7v6h6V7z" />
                            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold text-blue-700 dark:text-blue-300">Power: {artifact.power}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-lg">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold text-green-700 dark:text-green-300">GL: {artifact.gearLevel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold text-purple-700 dark:text-purple-300">+{artifact.enhancementLevel}</span>
                        </div>
                      </div>
                      {artifact.attributes && artifact.attributes.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Attributes</p>
                          {artifact.attributes.filter(attr => attr.name).map((attr) => (
                            <div key={attr.id} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-3 py-2 rounded-lg border-l-4 border-green-500">
                              <span className="font-bold text-green-700 dark:text-green-300">{attr.name}</span>
                              {attr.description && (
                                <span className="text-gray-700 dark:text-gray-300 ml-2">• {attr.description}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weapons Section */}
        {(primaryWeapon || powerWeapon) && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded"></div>
              Weapons
              <span className="text-base font-normal text-gray-500 dark:text-gray-400">({[primaryWeapon, powerWeapon].filter(Boolean).length}/2)</span>
            </h2>
            <div className="space-y-8">
              {[primaryWeapon, powerWeapon].filter(Boolean).map((weapon) => (
                <div
                  key={weapon!.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500"
                >
                  {/* Weapon Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                    <div className="flex items-start gap-6">
                      {weapon!.weapon?.imageUrl && (
                        <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30">
                          <img
                            src={weapon!.weapon.imageUrl}
                            alt={weapon!.customName || weapon!.weapon.name}
                            className="w-28 h-28 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border border-white/30">
                            {weapon!.slot} Weapon
                          </span>
                          {weapon!.weapon && (
                            <>
                              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border border-white/30">
                                {weapon!.weapon.weaponType}
                              </span>
                              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border border-white/30">
                                {weapon!.weapon.element}
                              </span>
                              <span className={`text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border ${
                                weapon!.weapon.rarity === 6
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-300'
                                  : 'bg-white/20 backdrop-blur-sm text-white border-white/30'
                              }`}>
                                {'★'.repeat(weapon!.weapon.rarity)} {weapon!.weapon.rarity === 6 ? 'Exotic' : ''}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-bold text-3xl text-white mb-2 drop-shadow-lg">
                          {weapon!.customName || weapon!.weapon?.name || 'Custom Weapon'}
                        </h3>
                        <div className="flex gap-4 text-white/90">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Gear Level {weapon!.gearLevel}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold">Enhancement +{weapon!.enhancementLevel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weapon Components Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Traits */}
                    {weapon!.traits && weapon!.traits.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          Traits
                        </h4>
                        <div className="space-y-3">
                          {weapon!.traits.map((trait) => (
                            <div key={trait.id} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-lg border-l-4 border-amber-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm text-gray-900 dark:text-white">{trait.name}</div>
                              {trait.description && (
                                <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{trait.description}</div>
                              )}
                              {trait.effect && (
                                <div className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-medium">⚡ {trait.effect}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Perks */}
                    {weapon!.perks && weapon!.perks.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Perks
                        </h4>
                        <div className="space-y-3">
                          {weapon!.perks.map((perk) => (
                            <div key={perk.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm text-gray-900 dark:text-white">{perk.name}</div>
                              {perk.description && (
                                <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{perk.description}</div>
                              )}
                              {perk.effect && (
                                <div className="text-xs text-blue-700 dark:text-blue-400 mt-1 font-medium">⚡ {perk.effect}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Catalysts */}
                    {weapon!.catalysts && weapon!.catalysts.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          Catalysts
                        </h4>
                        <div className="space-y-3">
                          {weapon!.catalysts.map((catalyst) => (
                            <div key={catalyst.id} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm text-gray-900 dark:text-white">{catalyst.name}</div>
                              {catalyst.description && (
                                <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{catalyst.description}</div>
                              )}
                              {catalyst.effect && (
                                <div className="text-xs text-purple-700 dark:text-purple-400 mt-1 font-medium">⚡ {catalyst.effect}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mods */}
                    {weapon!.mods && weapon!.mods.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          Mods
                        </h4>
                        <div className="space-y-3">
                          {weapon!.mods.map((mod) => (
                            <div key={mod.id} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 rounded-lg border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm text-gray-900 dark:text-white">{mod.name}</div>
                              {mod.description && (
                                <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{mod.description}</div>
                              )}
                              {mod.effect && (
                                <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">⚡ {mod.effect}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 border-b-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Comments
              <span className="text-lg font-normal text-gray-500 dark:text-gray-400">({comments.length})</span>
            </h2>
          </div>

          <div className="p-6">
            {/* Comment Form */}
            {session ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="mb-4">
                  <RichTextEditor
                    value={newComment}
                    onChange={setNewComment}
                    placeholder="Share your thoughts..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 text-center">
                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
                  Join the conversation
                </p>
                <button
                  onClick={() => router.push('/api/auth/signin')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Sign in to comment
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    No comments yet
                  </p>
                  <p className="text-gray-400 dark:text-gray-500">
                    Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {comment.user.image ? (
                          <img
                            src={comment.user.image}
                            alt={comment.user.name}
                            className="w-10 h-10 rounded-full border-2 border-blue-500"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{comment.user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      {session?.user?.id === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                    <div
                      className="prose dark:prose-invert max-w-none prose-sm"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
