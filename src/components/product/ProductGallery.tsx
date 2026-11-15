"use client";

import React, { useState } from "react";
import NekiImage from "@/components/ui/NekiImage";

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

/**
 * Product photo gallery with captions.
 * Gift sets show the items, the closed box and the inside of the box (round 1: T4
 * did not know what the box looks like inside and outside).
 */
export default function ProductGallery({
  images,
  badge,
}: {
  images: GalleryImage[];
  badge?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="bg-white rounded-3xl p-4 border border-nekicho-border shadow-elevated space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-nekicho-bg border border-nekicho-subtle">
        <NekiImage src={current.src} alt={current.alt} fill priority className="w-full h-full object-cover" />
        {badge}
      </div>
      <p className="text-sm text-nekicho-text text-center font-medium">{current.caption}</p>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`text-left rounded-2xl border-2 overflow-hidden transition ${
                i === active ? "border-nekicho-primary" : "border-nekicho-border hover:border-nekicho-light"
              }`}
              aria-label={img.caption}
            >
              <div className="relative aspect-square bg-nekicho-bg">
                <NekiImage src={img.src} alt={img.alt} fill className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-nekicho-text p-1.5 leading-tight">{img.caption}</p>
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-nekicho-muted text-center">Ảnh minh họa của concept, chưa phải ảnh chụp sản phẩm thật.</p>
    </div>
  );
}
