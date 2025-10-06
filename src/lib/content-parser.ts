/**
 * Utility functions for parsing and enhancing HTML content
 */

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract headings from HTML content and generate table of contents
 */
export function generateTableOfContents(html: string): TableOfContentsItem[] {
  if (typeof window === 'undefined') {
    // Server-side: simple regex-based parsing
    const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
    const toc: TableOfContentsItem[] = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, ''); // Strip HTML tags
      const id = `section-${index}`;
      toc.push({ id, text, level });
      index++;
    }

    return toc;
  }

  // Client-side: use DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');

  return Array.from(headings).map((heading, index) => ({
    id: `section-${index}`,
    text: heading.textContent || '',
    level: parseInt(heading.tagName.charAt(1)),
  }));
}

/**
 * Add anchor IDs to headings in HTML content
 */
export function addAnchorIds(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: regex-based replacement
    let index = 0;
    return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, content) => {
      const id = `section-${index}`;
      index++;
      return `<h${level} id="${id}"${attrs}>${content}</h${level}>`;
    });
  }

  // Client-side: use DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');

  headings.forEach((heading, index) => {
    heading.id = `section-${index}`;
  });

  return doc.body.innerHTML;
}

/**
 * Slugify text for URL-friendly IDs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
