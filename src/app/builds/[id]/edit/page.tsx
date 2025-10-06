'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacterImage } from '@/lib/image-assets';
import ArtifactConfigurator from '@/components/builds/ArtifactConfigurator';
import WeaponConfigurator from '@/components/builds/WeaponConfigurator';

interface Character {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface ArtifactData {
  slot: number;
  artifactName: string;
  rarity: string;
  power: number;
  gearLevel: number;
  enhancementLevel: number;
  attributes: { name: string; description: string }[];
}

interface WeaponData {
  weaponId: string | null;
  slot: string;
  customName: string;
  gearLevel: number;
  enhancementLevel: number;
  rarity: number;
  traits: { name: string; description: string; effect: string }[];
  perks: { name: string; description: string; effect: string }[];
  catalysts: { name: string; description: string; effect: string }[];
  mods: { name: string; description: string; effect: string }[];
}

export default function EditBuildPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const buildId = params.id as string;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [weapons, setWeapons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Artifacts (4 artifacts)
  const [artifacts, setArtifacts] = useState<ArtifactData[]>([
    { slot: 1, artifactName: '', rarity: 'Mythic', power: 0, gearLevel: 0, enhancementLevel: 0, attributes: [{ name: '', description: '' }, { name: '', description: '' }, { name: '', description: '' }] },
    { slot: 2, artifactName: '', rarity: 'Mythic', power: 0, gearLevel: 0, enhancementLevel: 0, attributes: [{ name: '', description: '' }, { name: '', description: '' }, { name: '', description: '' }] },
    { slot: 3, artifactName: '', rarity: 'Mythic', power: 0, gearLevel: 0, enhancementLevel: 0, attributes: [{ name: '', description: '' }, { name: '', description: '' }, { name: '', description: '' }] },
    { slot: 4, artifactName: '', rarity: 'Mythic', power: 0, gearLevel: 0, enhancementLevel: 0, attributes: [{ name: '', description: '' }, { name: '', description: '' }, { name: '', description: '' }] }
  ]);

  // Weapons
  const [primaryWeapon, setPrimaryWeapon] = useState<WeaponData>({
    weaponId: null, slot: 'Primary', customName: '', gearLevel: 0, enhancementLevel: 0, rarity: 0, traits: [], perks: [], catalysts: [], mods: []
  });

  const [powerWeapon, setPowerWeapon] = useState<WeaponData>({
    weaponId: null, slot: 'Power', customName: '', gearLevel: 0, enhancementLevel: 0, rarity: 0, traits: [], perks: [], catalysts: [], mods: []
  });

  useEffect(() => {
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }
    loadData();
  }, [session, router, buildId]);

  const loadData = async () => {
    try {
      const [charactersRes, weaponsRes, buildRes] = await Promise.all([
        fetch('/api/characters'),
        fetch('/api/weapons?limit=1000'),
        fetch(`/api/builds/${buildId}`)
      ]);

      const charactersData = await charactersRes.json();
      const weaponsData = await weaponsRes.json();
      const buildData = await buildRes.json();

      // Check if user owns this build
      if (buildData.user.id !== session?.user?.id) {
        alert('You do not have permission to edit this build');
        router.push(`/builds/${buildId}`);
        return;
      }

      setCharacters(charactersData.characters || charactersData || []);
      setWeapons(weaponsData.data || weaponsData.weapons || weaponsData || []);

      // Populate form with existing build data
      setTitle(buildData.title);
      setDescription(buildData.description || '');
      setSelectedCharacterId(buildData.characterId);
      setIsPublic(buildData.isPublic);

      // Populate artifacts
      if (buildData.artifacts && buildData.artifacts.length > 0) {
        const loadedArtifacts = [...artifacts];
        buildData.artifacts.forEach((artifact: any) => {
          const slotIndex = artifact.slot - 1;
          if (slotIndex >= 0 && slotIndex < 4) {
            loadedArtifacts[slotIndex] = {
              slot: artifact.slot,
              artifactName: artifact.artifactName,
              rarity: artifact.rarity,
              power: artifact.power || 0,
              gearLevel: artifact.gearLevel || 0,
              enhancementLevel: artifact.enhancementLevel || 0,
              attributes: artifact.attributes || []
            };
          }
        });
        setArtifacts(loadedArtifacts);
      }

      // Populate weapons
      buildData.weapons?.forEach((weapon: any) => {
        const weaponData = {
          weaponId: weapon.weaponId,
          slot: weapon.slot,
          customName: weapon.customName || '',
          gearLevel: weapon.gearLevel || 0,
          enhancementLevel: weapon.enhancementLevel || 0,
          rarity: weapon.weapon?.rarity || 0,
          traits: weapon.traits || [],
          perks: weapon.perks || [],
          catalysts: weapon.catalysts || [],
          mods: weapon.mods || []
        };

        if (weapon.slot === 'Primary') {
          setPrimaryWeapon(weaponData);
        } else if (weapon.slot === 'Power') {
          setPowerWeapon(weaponData);
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load build data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCharacterId || !title) {
      alert('Please fill in required fields (Character and Title)');
      return;
    }

    setSubmitting(true);

    try {
      const buildData = {
        title,
        description,
        characterId: selectedCharacterId,
        isPublic,
        content: '',
        artifacts,
        primaryWeapon,
        powerWeapon
      };

      const res = await fetch(`/api/builds/${buildId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildData)
      });

      if (res.ok) {
        router.push(`/builds/${buildId}`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update build');
      }
    } catch (error) {
      console.error('Error updating build:', error);
      alert('Failed to update build');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Build</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your character build
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {['Basic Info', 'Artifacts', 'Weapons', 'Review'].map((step, idx) => (
            <button
              key={step}
              onClick={() => setActiveStep(idx + 1)}
              className={`py-3 px-4 rounded-lg font-medium transition ${
                activeStep === idx + 1
                  ? 'bg-blue-600 text-white shadow-lg'
                  : activeStep > idx + 1
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
              }`}
            >
              {idx + 1}. {step}
            </button>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {activeStep === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Build Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                placeholder="e.g., Tank Ikora Build - 50K HP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                rows={4}
                placeholder="Describe your build strategy, playstyle, and key features..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Select Character *</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {characters.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelectedCharacterId(char.id)}
                    className={`relative rounded-lg overflow-hidden border-4 transition transform hover:scale-105 ${
                      selectedCharacterId === char.id
                        ? 'border-blue-500 scale-105 shadow-lg'
                        : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={getCharacterImage(char.name) || ''}
                      alt={char.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white text-xs py-2 px-2 text-center font-medium">
                      {char.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
                Make this build public (visible to everyone in the community)
              </label>
            </div>

            <button
              onClick={() => setActiveStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
            >
              Next: Configure Artifacts →
            </button>
          </div>
        )}

        {/* Step 2: Artifacts */}
        {activeStep === 2 && (
          <div>
            <ArtifactConfigurator artifacts={artifacts} onChange={setArtifacts} />

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveStep(1)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 rounded-lg transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
              >
                Next: Configure Weapons →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Weapons */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <WeaponConfigurator
              slot="Primary"
              weapons={weapons}
              weaponData={primaryWeapon}
              onChange={setPrimaryWeapon}
            />
            <WeaponConfigurator
              slot="Power"
              weapons={weapons}
              weaponData={powerWeapon}
              onChange={setPowerWeapon}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setActiveStep(2)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 rounded-lg transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
              >
                Next: Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {activeStep === 4 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Review Your Changes</h2>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Title</p>
                <p className="font-bold text-lg">{title || '(Not set)'}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Character</p>
                <p className="font-bold">
                  {characters.find((c) => c.id === selectedCharacterId)?.name || '(Not selected)'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Privacy</p>
                <p className="font-bold">{isPublic ? 'Public' : 'Private'}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Artifacts Configured</p>
                <p className="font-bold">
                  {artifacts.filter((a) => a.artifactName).length} / 4 artifacts selected
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weapons Configured</p>
                <p className="font-bold">
                  {[primaryWeapon, powerWeapon].filter((w) => w.weaponId || w.customName).length} / 2 weapons configured
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setActiveStep(3)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 rounded-lg transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !title || !selectedCharacterId}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Updating Build...' : 'Update Build'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
