'use client';

import { ContentBlock, HeadingBlock, TextBlock, VideoBlock, ImageBlock, DividerBlock, StatsBlock, ArtifactsBlock, WeaponsBlock } from '@/types/blocks';
import { useTheme } from '@/contexts/ThemeContext';
import { getArtifactImagePath, formatArtifactName, type ArtifactSlot } from '@/lib/artifact-assets';

interface BlockRendererProps {
  blocks: ContentBlock[];
  artifacts?: any[];
  weapons?: any[];
}

export default function BlockRenderer({ blocks, artifacts = [], weapons = [] }: BlockRendererProps) {
  const { colors } = useTheme();

  const getVideoEmbed = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Twitch
    const twitchMatch = url.match(/twitch\.tv\/videos\/(\d+)/);
    if (twitchMatch) {
      return `https://player.twitch.tv/?video=${twitchMatch[1]}&parent=${window.location.hostname}`;
    }

    return url;
  };

  const getWidthClass = (width: string) => {
    switch (width) {
      case 'half':
        return 'md:w-1/2';
      case 'third':
        return 'md:w-1/3';
      case 'two-thirds':
        return 'md:w-2/3';
      default:
        return 'w-full';
    }
  };

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        const headingBlock = block as HeadingBlock;
        const HeadingTag = `h${headingBlock.content.level}` as keyof JSX.IntrinsicElements;
        const headingSizes = {
          1: 'text-4xl md:text-5xl',
          2: 'text-3xl md:text-4xl',
          3: 'text-2xl md:text-3xl',
        };
        return (
          <HeadingTag
            className={`font-bold mb-4 ${headingSizes[headingBlock.content.level]}`}
            style={{ color: colors.text.primary }}
          >
            {headingBlock.content.text}
          </HeadingTag>
        );

      case 'text':
        const textBlock = block as TextBlock;
        return (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: textBlock.content.html }}
          />
        );

      case 'video':
        const videoBlock = block as VideoBlock;
        if (!videoBlock.content.url) return null;
        return (
          <div>
            {videoBlock.content.title && (
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.text.primary }}>
                {videoBlock.content.title}
              </h3>
            )}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getVideoEmbed(videoBlock.content.url)}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );

      case 'image':
        const imageBlock = block as ImageBlock;
        if (!imageBlock.content.url) return null;
        return (
          <div>
            <img
              src={imageBlock.content.url}
              alt={imageBlock.content.alt || ''}
              className="w-full h-auto rounded-lg shadow-md"
            />
            {imageBlock.content.caption && (
              <p className="text-sm text-center mt-2" style={{ color: colors.text.secondary }}>
                {imageBlock.content.caption}
              </p>
            )}
          </div>
        );

      case 'divider':
        const dividerBlock = block as DividerBlock;
        return (
          <hr
            className="my-8"
            style={{
              borderTop: `2px ${dividerBlock.content.style} ${colors.border.primary}`,
            }}
          />
        );

      case 'table-of-contents':
        // Generate TOC from headings in blocks
        const headings = blocks
          .filter((b) => b.type === 'heading')
          .map((b) => (b as HeadingBlock).content);

        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.text.primary }}>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Table of Contents
            </h3>
            <ul className="space-y-2">
              {headings.map((heading, index) => (
                <li key={index} style={{ paddingLeft: `${(heading.level - 1) * 1.5}rem` }}>
                  <a
                    href={`#heading-${index}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'stats':
        const statsBlock = block as StatsBlock;
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
              {statsBlock.content.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statsBlock.content.stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-l-4 border-blue-600"
                >
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'artifacts':
        if (!artifacts || artifacts.length === 0) {
          return (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 border-2 border-dashed rounded-lg" style={{ borderColor: colors.border.secondary }}>
              No artifacts configured for this build yet.
            </div>
          );
        }
        return (
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.text.primary }}>
              <div className="w-1 h-8 bg-blue-600 rounded"></div>
              Artifacts
              <span className="text-base font-normal" style={{ color: colors.text.secondary }}>({artifacts.length}/4)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border.primary
                  }}
                >
                  <div className="flex items-start gap-5">
                    {artifact.artifactName && (
                      <div className="flex-shrink-0 rounded-xl p-3 border-2" style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border.secondary
                      }}>
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
                      <h3 className="font-bold text-xl mb-3" style={{ color: colors.text.primary }}>
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
                          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: colors.text.secondary }}>Attributes</p>
                          {artifact.attributes.filter((attr: any) => attr.name).map((attr: any) => (
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
        );

      case 'weapons':
        if (!weapons || weapons.length === 0) {
          return (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 border-2 border-dashed rounded-lg" style={{ borderColor: colors.border.secondary }}>
              No weapons configured for this build yet.
            </div>
          );
        }
        const primaryWeapon = weapons.find((w: any) => w.slot === 'Primary');
        const powerWeapon = weapons.find((w: any) => w.slot === 'Power');

        return (
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3" style={{ color: colors.text.primary }}>
              <div className="w-1 h-8 bg-blue-600 rounded"></div>
              Weapons
              <span className="text-base font-normal" style={{ color: colors.text.secondary }}>({weapons.length}/2)</span>
            </h2>
            <div className="space-y-8">
              {[primaryWeapon, powerWeapon].filter(Boolean).map((weapon: any) => (
                <div
                  key={weapon.id}
                  className="rounded-xl shadow-lg border-2 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:border-blue-500"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border.primary
                  }}
                >
                  {/* Weapon Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                    <div className="flex items-start gap-6">
                      {weapon.weapon?.imageUrl && (
                        <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30">
                          <img
                            src={weapon.weapon.imageUrl}
                            alt={weapon.customName || weapon.weapon.name}
                            className="w-28 h-28 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border border-white/30">
                            {weapon.slot} Weapon
                          </span>
                          {weapon.weapon && (
                            <>
                              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border border-white/30">
                                {weapon.weapon.weaponType}
                              </span>
                              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border border-white/30">
                                {weapon.weapon.element}
                              </span>
                              <span className={`text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm border ${
                                weapon.weapon.rarity === 6
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-300'
                                  : 'bg-white/20 backdrop-blur-sm text-white border-white/30'
                              }`}>
                                {'★'.repeat(weapon.weapon.rarity)} {weapon.weapon.rarity === 6 ? 'Exotic' : ''}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-bold text-3xl text-white mb-2 drop-shadow-lg">
                          {weapon.customName || weapon.weapon?.name || 'Custom Weapon'}
                        </h3>
                        <div className="flex gap-4 text-white/90">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Gear Level {weapon.gearLevel}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold">Enhancement +{weapon.enhancementLevel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weapon Components Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Traits */}
                    {weapon.traits && weapon.traits.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: colors.text.secondary }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          Traits
                        </h4>
                        <div className="space-y-3">
                          {weapon.traits.map((trait: any) => (
                            <div key={trait.id} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 rounded-lg border-l-4 border-amber-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm" style={{ color: colors.text.primary }}>{trait.name}</div>
                              {trait.description && (
                                <div className="text-xs mt-1" style={{ color: colors.text.secondary }}>{trait.description}</div>
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
                    {weapon.perks && weapon.perks.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: colors.text.secondary }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Perks
                        </h4>
                        <div className="space-y-3">
                          {weapon.perks.map((perk: any) => (
                            <div key={perk.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm" style={{ color: colors.text.primary }}>{perk.name}</div>
                              {perk.description && (
                                <div className="text-xs mt-1" style={{ color: colors.text.secondary }}>{perk.description}</div>
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
                    {weapon.catalysts && weapon.catalysts.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: colors.text.secondary }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          Catalysts
                        </h4>
                        <div className="space-y-3">
                          {weapon.catalysts.map((catalyst: any) => (
                            <div key={catalyst.id} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm" style={{ color: colors.text.primary }}>{catalyst.name}</div>
                              {catalyst.description && (
                                <div className="text-xs mt-1" style={{ color: colors.text.secondary }}>{catalyst.description}</div>
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
                    {weapon.mods && weapon.mods.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: colors.text.secondary }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          Mods
                        </h4>
                        <div className="space-y-3">
                          {weapon.mods.map((mod: any) => (
                            <div key={mod.id} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow">
                              <div className="font-bold text-sm" style={{ color: colors.text.primary }}>{mod.name}</div>
                              {mod.description && (
                                <div className="text-xs mt-1" style={{ color: colors.text.secondary }}>{mod.description}</div>
                              )}
                              {mod.effect && (
                                <div className="text-xs text-green-700 dark:text-green-400 mt-1 font-medium">⚡ {mod.effect}</div>
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
        );

      default:
        return null;
    }
  };

  // Group blocks by rows based on their widths
  const renderBlocksInRows = () => {
    const rows: JSX.Element[] = [];
    let currentRow: ContentBlock[] = [];
    let currentRowWidth = 0;

    blocks.forEach((block, index) => {
      const widthValue = {
        'full': 1,
        'two-thirds': 0.66,
        'half': 0.5,
        'third': 0.33,
      }[block.width] || 1;

      if (currentRowWidth + widthValue > 1) {
        // Start new row
        rows.push(
          <div key={`row-${rows.length}`} className="flex flex-wrap gap-6 mb-6">
            {currentRow.map((b) => (
              <div key={b.id} className={`${getWidthClass(b.width)} px-2`}>
                {renderBlock(b)}
              </div>
            ))}
          </div>
        );
        currentRow = [block];
        currentRowWidth = widthValue;
      } else {
        currentRow.push(block);
        currentRowWidth += widthValue;
      }
    });

    // Render remaining blocks
    if (currentRow.length > 0) {
      rows.push(
        <div key={`row-${rows.length}`} className="flex flex-wrap gap-6 mb-6">
          {currentRow.map((b) => (
            <div key={b.id} className={`${getWidthClass(b.width)} px-2`}>
              {renderBlock(b)}
            </div>
          ))}
        </div>
      );
    }

    return rows;
  };

  if (blocks.length === 0) {
    return null;
  }

  return <div>{renderBlocksInRows()}</div>;
}
