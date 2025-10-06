// Content Block Types for Build Guide System

export type BlockType =
  | 'heading'
  | 'text'
  | 'video'
  | 'image'
  | 'divider'
  | 'table-of-contents'
  | 'stats'
  | 'artifacts'
  | 'weapons';

export type BlockWidth = 'full' | 'half' | 'third' | 'two-thirds';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
  width: BlockWidth;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  content: {
    text: string;
    level: 1 | 2 | 3; // h1, h2, h3
  };
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: {
    html: string; // Rich text content
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  content: {
    url: string; // YouTube, Twitch, etc.
    title?: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  content: {
    url: string;
    alt?: string;
    caption?: string;
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  content: {
    style: 'solid' | 'dashed' | 'dotted';
  };
}

export interface TableOfContentsBlock extends BaseBlock {
  type: 'table-of-contents';
  content: {
    title: string;
  };
}

export interface StatsBlock extends BaseBlock {
  type: 'stats';
  content: {
    title: string;
    stats: Array<{
      label: string;
      value: string;
      icon?: string;
    }>;
  };
}

export interface ArtifactsBlock extends BaseBlock {
  type: 'artifacts';
  content: {
    title?: string;
    showAll: boolean; // Show all artifacts or specific ones
    artifactIds?: string[]; // If not showing all
  };
}

export interface WeaponsBlock extends BaseBlock {
  type: 'weapons';
  content: {
    title?: string;
    showAll: boolean;
    weaponSlots?: ('Primary' | 'Power')[];
  };
}

export type ContentBlock =
  | HeadingBlock
  | TextBlock
  | VideoBlock
  | ImageBlock
  | DividerBlock
  | TableOfContentsBlock
  | StatsBlock
  | ArtifactsBlock
  | WeaponsBlock;

// Block templates for quick insertion
export const BLOCK_TEMPLATES: Record<BlockType, Omit<ContentBlock, 'id' | 'order'>> = {
  heading: {
    type: 'heading',
    width: 'full',
    content: {
      text: 'New Heading',
      level: 2,
    },
  },
  text: {
    type: 'text',
    width: 'full',
    content: {
      html: '<p>Type your content here...</p>',
    },
  },
  video: {
    type: 'video',
    width: 'full',
    content: {
      url: '',
      title: '',
    },
  },
  image: {
    type: 'image',
    width: 'full',
    content: {
      url: '',
      alt: '',
      caption: '',
    },
  },
  divider: {
    type: 'divider',
    width: 'full',
    content: {
      style: 'solid',
    },
  },
  'table-of-contents': {
    type: 'table-of-contents',
    width: 'full',
    content: {
      title: 'Table of Contents',
    },
  },
  stats: {
    type: 'stats',
    width: 'full',
    content: {
      title: 'Build Stats',
      stats: [],
    },
  },
  artifacts: {
    type: 'artifacts',
    width: 'full',
    content: {
      title: 'Artifacts',
      showAll: true,
    },
  },
  weapons: {
    type: 'weapons',
    width: 'full',
    content: {
      title: 'Weapons',
      showAll: true,
    },
  },
} as any;
