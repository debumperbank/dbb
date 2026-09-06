'use client';

import { useState } from 'react';

interface PhotoCarouselProps {
  photos: { id: string; url: string; caption?: string | null }[];
  altPrefix: string;
}

export function PhotoCarousel({ photos, altPrefix }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) return null;

  const current = photos[index];
  const prev = () => setIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <div className="mt-4">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-[color:var(--line-dark)] bg-bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.caption ?? `${altPrefix} ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Vorige foto"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg/80 border border-[color:var(--line-dark)] flex items-center justify-center hover:bg-bg transition-colors"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Volgende foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg/80 border border-[color:var(--line-dark)] flex items-center justify-center hover:bg-bg transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-3 right-3 font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-bg/80 border border-[color:var(--line-dark)]">
              {index + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {current.caption && (
        <p className="mt-2 text-[13px] text-muted">{current.caption}</p>
      )}

      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`aspect-square rounded-[3px] overflow-hidden border ${
                i === index ? 'border-orange' : 'border-[color:var(--line-dark)]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}