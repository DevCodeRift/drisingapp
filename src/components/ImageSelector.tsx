'use client';

import { useState, useEffect } from 'react';

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

interface ImageFile {
  name: string;
  url: string;
}

export default function ImageSelector({ value, onChange, label }: ImageSelectorProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && images.length === 0) {
      setLoading(true);
      fetch('/api/images/weapons')
        .then(res => res.json())
        .then(data => {
          setImages(data.images || []);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading images:', error);
          setLoading(false);
        });
    }
  }, [isOpen, images.length]);

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (url: string) => {
    onChange(url);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="image-selector">
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter image URL or select from gallery"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-secondary btn-small"
            style={{ whiteSpace: 'nowrap' }}
          >
            {isOpen ? 'Close Gallery' : 'Browse Images'}
          </button>
        </div>

        {value && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={value}
              alt="Selected"
              style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '4px', padding: '5px' }}
            />
          </div>
        )}

        {isOpen && (
          <div className="image-selector-modal">
            <div className="image-selector-content">
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="image-search"
              />

              {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>Loading images...</p>
              ) : (
                <div className="image-grid">
                  {filteredImages.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>
                      No images found
                    </p>
                  ) : (
                    filteredImages.map((img) => (
                      <div
                        key={img.url}
                        className={`image-item ${value === img.url ? 'selected' : ''}`}
                        onClick={() => handleSelect(img.url)}
                      >
                        <img src={img.url} alt={img.name} />
                        <div className="image-name">{img.name}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .image-selector-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .image-selector-content {
          background: white;
          border-radius: 8px;
          max-width: 1000px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .image-search {
          margin: 20px;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          padding: 0 20px 20px;
          overflow-y: auto;
          max-height: calc(80vh - 100px);
        }

        .image-item {
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .image-item:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .image-item.selected {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        .image-item img {
          width: 100%;
          height: 100px;
          object-fit: contain;
          margin-bottom: 5px;
        }

        .image-name {
          font-size: 11px;
          color: #6b7280;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        @media (prefers-color-scheme: dark) {
          .image-selector-content {
            background: #1f2937;
            color: #f9fafb;
          }

          .image-search {
            background: #374151;
            border-color: #4b5563;
            color: #f9fafb;
          }

          .image-item {
            border-color: #4b5563;
          }

          .image-item:hover {
            background: #374151;
          }

          .image-item.selected {
            background: #1e3a5f;
          }
        }
      `}</style>
    </div>
  );
}
