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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/builds')}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
        >
          ← Back to Builds
        </button>

        {/* Build Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-6 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={getCharacterImage(build.character.name) || ''}
                  alt={build.character.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h1 className="text-4xl font-bold">{build.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                      {build.character.name}
                    </span>
                    <span>by {build.user.name}</span>
                    <span>{new Date(build.createdAt).toLocaleDateString()}</span>
                    {!build.isPublic && (
                      <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {build.description && (
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{build.description}</p>
              )}
            </div>

            <div className="flex gap-3">
              {session?.user?.id === build.user.id && (
                <button
                  onClick={() => router.push(`/builds/${build.id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
              <button
                onClick={handleUpvote}
                className={`flex flex-col items-center px-6 py-3 rounded-lg transition border-2 ${
                  hasUpvoted()
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-600'
                }`}
              >
              <span className="text-3xl">▲</span>
              <span className="text-xl font-bold">{build.voteCount || 0}</span>
            </button>
          </div>
        </div>

        {/* Artifacts Section */}
        {build.artifacts && build.artifacts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Artifacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {build.artifacts.map((artifact) => (
                <div key={artifact.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                  <div className="flex items-start gap-4">
                    {artifact.artifactName && (
                      <img
                        src={getArtifactImagePath(artifact.slot as ArtifactSlot, artifact.artifactName)}
                        alt={formatArtifactName(artifact.artifactName)}
                        className="w-20 h-20 object-contain rounded border-2 border-gray-300 dark:border-gray-600 p-1"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded font-medium">
                          Slot {artifact.slot}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          artifact.rarity === 'Exotic' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          artifact.rarity === 'Mythic' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {artifact.rarity}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-1">
                        {artifact.artifactName ? formatArtifactName(artifact.artifactName) : `Artifact ${artifact.slot}`}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Power: {artifact.power} | Gear: {artifact.gearLevel} | Enhancement: {artifact.enhancementLevel}
                      </div>
                      {artifact.attributes && artifact.attributes.length > 0 && (
                        <div className="space-y-1">
                          {artifact.attributes.filter(attr => attr.name).map((attr) => (
                            <div key={attr.id} className="text-sm bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                              <span className="font-medium text-green-600 dark:text-green-400">{attr.name}</span>
                              {attr.description && (
                                <span className="text-gray-600 dark:text-gray-400 ml-2">- {attr.description}</span>
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Weapons</h2>
            <div className="space-y-6">
              {[primaryWeapon, powerWeapon].filter(Boolean).map((weapon) => (
                <div key={weapon!.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  {/* Weapon Header */}
                  <div className="flex items-start gap-4 mb-4">
                    {weapon!.weapon?.imageUrl && (
                      <img
                        src={weapon!.weapon.imageUrl}
                        alt={weapon!.customName || weapon!.weapon.name}
                        className="w-24 h-24 object-contain rounded border-2 border-gray-300 dark:border-gray-600 p-2"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded font-medium">
                          {weapon!.slot}
                        </span>
                        {weapon!.weapon && (
                          <>
                            <span className="text-xs px-2 py-1 rounded font-medium bg-gray-100 dark:bg-gray-700">
                              {weapon!.weapon.weaponType}
                            </span>
                            <span className="text-xs px-2 py-1 rounded font-medium bg-gray-100 dark:bg-gray-700">
                              {weapon!.weapon.element}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              weapon!.weapon.rarity === 6 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}>
                              {weapon!.weapon.rarity}★ {weapon!.weapon.rarity === 6 ? 'Exotic' : ''}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-bold text-xl">
                        {weapon!.customName || weapon!.weapon?.name || 'Custom Weapon'}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Gear Level: {weapon!.gearLevel} | Enhancement: {weapon!.enhancementLevel}
                      </div>
                    </div>
                  </div>

                  {/* Weapon Components */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Traits */}
                    {weapon!.traits && weapon!.traits.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">TRAITS</h4>
                        <div className="space-y-2">
                          {weapon!.traits.map((trait) => (
                            <div key={trait.id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                              <div className="font-medium text-sm">{trait.name}</div>
                              {trait.description && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{trait.description}</div>
                              )}
                              {trait.effect && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{trait.effect}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Perks */}
                    {weapon!.perks && weapon!.perks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">PERKS</h4>
                        <div className="space-y-2">
                          {weapon!.perks.map((perk) => (
                            <div key={perk.id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                              <div className="font-medium text-sm">{perk.name}</div>
                              {perk.description && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{perk.description}</div>
                              )}
                              {perk.effect && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{perk.effect}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Catalysts */}
                    {weapon!.catalysts && weapon!.catalysts.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">CATALYSTS</h4>
                        <div className="space-y-2">
                          {weapon!.catalysts.map((catalyst) => (
                            <div key={catalyst.id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                              <div className="font-medium text-sm">{catalyst.name}</div>
                              {catalyst.description && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{catalyst.description}</div>
                              )}
                              {catalyst.effect && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{catalyst.effect}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mods */}
                    {weapon!.mods && weapon!.mods.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">MODS</h4>
                        <div className="space-y-2">
                          {weapon!.mods.map((mod) => (
                            <div key={mod.id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                              <div className="font-medium text-sm">{mod.name}</div>
                              {mod.description && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{mod.description}</div>
                              )}
                              {mod.effect && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{mod.effect}</div>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

          {/* Comment Form */}
          {session ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder="Share your thoughts..."
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              <button
                onClick={() => router.push('/api/auth/signin')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                Sign in
              </button>{' '}
              to comment
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      {comment.user.image && (
                        <img
                          src={comment.user.image}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-bold">{comment.user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {session?.user?.id === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-600 hover:text-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
