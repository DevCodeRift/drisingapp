'use client';

import { useState } from 'react';
import { ContentBlock, BlockType, BLOCK_TEMPLATES, BlockWidth } from '@/types/blocks';
import { useTheme } from '@/contexts/ThemeContext';
import BlockEditor from './BlockEditor';

interface BlockBuilderProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function BlockBuilder({ blocks, onChange }: BlockBuilderProps) {
  const { colors } = useTheme();
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addBlock = (type: BlockType) => {
    const template = BLOCK_TEMPLATES[type];
    const newBlock: ContentBlock = {
      ...template,
      id: `temp-${Date.now()}-${Math.random()}`,
      order: blocks.length,
    } as ContentBlock;

    onChange([...blocks, newBlock]);
    setShowBlockMenu(false);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates } as ContentBlock;
    onChange(newBlocks);
  };

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    // Reorder remaining blocks
    const reorderedBlocks = newBlocks.map((block, i) => ({ ...block, order: i }));
    onChange(reorderedBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);

    // Reorder all blocks
    const reorderedBlocks = newBlocks.map((block, i) => ({ ...block, order: i }));
    onChange(reorderedBlocks);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    moveBlock(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const blockTypeIcons: Record<BlockType, string> = {
    heading: '📝',
    text: '📄',
    video: '🎥',
    image: '🖼️',
    divider: '➖',
    'table-of-contents': '📚',
    stats: '📊',
    artifacts: '💎',
    weapons: '⚔️',
  };

  const blockTypeLabels: Record<BlockType, string> = {
    heading: 'Heading',
    text: 'Text',
    video: 'Video',
    image: 'Image',
    divider: 'Divider',
    'table-of-contents': 'Table of Contents',
    stats: 'Stats Panel',
    artifacts: 'Artifacts',
    weapons: 'Weapons',
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Customize Your Build Guide
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              Create a professional guide by adding content blocks. Drag and drop to reorder, resize blocks, and add rich content like text, videos, and custom sections. Make it your own!
            </p>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              No content blocks yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Click the button below to add your first block
            </p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all ${
                draggedIndex === index
                  ? 'border-blue-500 shadow-lg opacity-50'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              {/* Block Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                  <span className="text-2xl">{blockTypeIcons[block.type]}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {blockTypeLabels[block.type]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Width Selector */}
                  <select
                    value={block.width}
                    onChange={(e) => updateBlock(index, { width: e.target.value as BlockWidth })}
                    className="text-sm px-3 py-1.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    <option value="full">Full Width</option>
                    <option value="two-thirds">2/3 Width</option>
                    <option value="half">Half Width</option>
                    <option value="third">1/3 Width</option>
                  </select>

                  {/* Move Up */}
                  <button
                    onClick={() => index > 0 && moveBlock(index, index - 1)}
                    disabled={index === 0}
                    className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: colors.text.secondary }}
                    title="Move up"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => index < blocks.length - 1 && moveBlock(index, index + 1)}
                    disabled={index === blocks.length - 1}
                    className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: colors.text.secondary }}
                    title="Move down"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (confirm('Delete this block?')) deleteBlock(index);
                    }}
                    className="p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    title="Delete block"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Block Content Editor */}
              <div className="p-4">
                <BlockEditor block={block} onChange={(updates) => updateBlock(index, updates)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Block Button */}
      <div className="relative">
        <button
          onClick={() => setShowBlockMenu(!showBlockMenu)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Content Block
        </button>

        {/* Block Type Menu */}
        {showBlockMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 z-10">
            {(Object.keys(BLOCK_TEMPLATES) as BlockType[]).map((type) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-transparent hover:border-blue-500 transition-all"
              >
                <span className="text-3xl">{blockTypeIcons[type]}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {blockTypeLabels[type]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
