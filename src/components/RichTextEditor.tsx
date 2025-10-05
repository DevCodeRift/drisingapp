'use client';

import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-destiny-dark">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-destiny-darker">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm font-bold transition"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm italic transition"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm underline transition"
          title="Underline"
        >
          U
        </button>
        <div className="w-px bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm transition"
          title="Heading"
        >
          H
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm transition"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm transition"
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) execCommand('createLink', url);
          }}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm transition"
          title="Insert Link"
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) execCommand('insertImage', url);
          }}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm transition"
          title="Insert Image"
        >
          🖼️ Image
        </button>
        <button
          type="button"
          onClick={() => {
            const color = prompt('Enter color (e.g., #ff0000 or red):');
            if (color) execCommand('foreColor', color);
          }}
          className="px-3 py-1 bg-destiny-dark hover:bg-gray-700 rounded text-sm transition"
          title="Text Color"
        >
          🎨 Color
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none text-white prose prose-invert max-w-none"
        data-placeholder={placeholder}
        style={{
          wordWrap: 'break-word',
        }}
      />

      <style jsx>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
