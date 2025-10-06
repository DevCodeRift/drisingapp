'use client';

import { ContentBlock, HeadingBlock, TextBlock, VideoBlock, ImageBlock, DividerBlock, StatsBlock } from '@/types/blocks';
import { useTheme } from '@/contexts/ThemeContext';
import RichTextEditor from '../RichTextEditor';

interface BlockEditorProps {
  block: ContentBlock;
  onChange: (updates: Partial<ContentBlock>) => void;
}

export default function BlockEditor({ block, onChange }: BlockEditorProps) {
  const { colors } = useTheme();

  const updateContent = (contentUpdates: any) => {
    onChange({
      content: {
        ...block.content,
        ...contentUpdates,
      },
    });
  };

  switch (block.type) {
    case 'heading':
      const headingBlock = block as HeadingBlock;
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heading Text
            </label>
            <input
              type="text"
              value={headingBlock.content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              placeholder="Enter heading text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heading Level
            </label>
            <select
              value={headingBlock.content.level}
              onChange={(e) => updateContent({ level: parseInt(e.target.value) as 1 | 2 | 3 })}
              className="px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
            >
              <option value={1}>H1 - Large</option>
              <option value={2}>H2 - Medium</option>
              <option value={3}>H3 - Small</option>
            </select>
          </div>
        </div>
      );

    case 'text':
      const textBlock = block as TextBlock;
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <RichTextEditor
            value={textBlock.content.html}
            onChange={(html) => updateContent({ html })}
            placeholder="Type your content here..."
          />
        </div>
      );

    case 'video':
      const videoBlock = block as VideoBlock;
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoBlock.content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports YouTube, Twitch, and direct video links
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Title (optional)
            </label>
            <input
              type="text"
              value={videoBlock.content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              placeholder="Optional title..."
            />
          </div>
        </div>
      );

    case 'image':
      const imageBlock = block as ImageBlock;
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageBlock.content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {imageBlock.content.url && (
            <div className="mt-2">
              <img
                src={imageBlock.content.url}
                alt={imageBlock.content.alt || 'Preview'}
                className="max-w-full h-auto rounded-lg border-2"
                style={{ borderColor: colors.border.primary }}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={imageBlock.content.alt || ''}
              onChange={(e) => updateContent({ alt: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              placeholder="Describe the image..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption (optional)
            </label>
            <input
              type="text"
              value={imageBlock.content.caption || ''}
              onChange={(e) => updateContent({ caption: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              placeholder="Optional caption..."
            />
          </div>
        </div>
      );

    case 'divider':
      const dividerBlock = block as DividerBlock;
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Divider Style
          </label>
          <select
            value={dividerBlock.content.style}
            onChange={(e) => updateContent({ style: e.target.value as 'solid' | 'dashed' | 'dotted' })}
            className="px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: colors.background,
              color: colors.text.primary,
              borderColor: colors.border.primary,
            }}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
          <div className="mt-4">
            <div
              className="w-full h-1"
              style={{
                borderTop: `2px ${dividerBlock.content.style} ${colors.border.primary}`,
              }}
            />
          </div>
        </div>
      );

    case 'table-of-contents':
      return (
        <div className="text-center py-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <svg className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Table of Contents will be auto-generated from all headings
          </p>
        </div>
      );

    case 'stats':
      const statsBlock = block as StatsBlock;
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Panel Title
            </label>
            <input
              type="text"
              value={statsBlock.content.title}
              onChange={(e) => updateContent({ title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors.background,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              placeholder="Build Stats"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stats
            </label>
            <div className="space-y-2">
              {statsBlock.content.stats.map((stat, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...statsBlock.content.stats];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      updateContent({ stats: newStats });
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border.primary,
                    }}
                    placeholder="Stat label..."
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...statsBlock.content.stats];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      updateContent({ stats: newStats });
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border.primary,
                    }}
                    placeholder="Value..."
                  />
                  <button
                    onClick={() => {
                      const newStats = statsBlock.content.stats.filter((_, i) => i !== index);
                      updateContent({ stats: newStats });
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newStats = [...statsBlock.content.stats, { label: '', value: '' }];
                updateContent({ stats: newStats });
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Stat
            </button>
          </div>
        </div>
      );

    case 'artifacts':
    case 'weapons':
      return (
        <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your {block.type} will be automatically displayed here
          </p>
        </div>
      );

    default:
      return (
        <div className="text-center py-4 text-gray-500">
          Editor for this block type is not implemented yet
        </div>
      );
  }
}
