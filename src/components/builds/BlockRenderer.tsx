'use client';

import { ContentBlock, HeadingBlock, TextBlock, VideoBlock, ImageBlock, DividerBlock, StatsBlock, ArtifactsBlock, WeaponsBlock } from '@/types/blocks';
import { useTheme } from '@/contexts/ThemeContext';

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
        // This will be rendered by the parent component with actual artifact data
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            [Artifacts will be displayed here]
          </div>
        );

      case 'weapons':
        // This will be rendered by the parent component with actual weapon data
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            [Weapons will be displayed here]
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
