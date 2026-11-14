"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getPastelPlaceholder } from "@/config/images";

interface NekiImageProps {
  src?: string | null;
  alt: string;
  category?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  aspectRatio?: "square" | "video" | "portrait";
}

export default function NekiImage({
  src,
  alt,
  category = "Gift",
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  aspectRatio = "square",
}: NekiImageProps) {
  const [error, setError] = useState(false);

  // If no source provided or failed to load, fall back to our brand pastel SVG generator
  const finalSrc = !src || error ? getPastelPlaceholder(alt, category) : src;
  const isDataUri = finalSrc.startsWith("data:image/svg+xml");

  if (fill) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {isDataUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={finalSrc}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={finalSrc}
            alt={alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onError={() => setError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
    );
  }

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
      ? "aspect-[4/5]"
      : "aspect-video";

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        onError={() => setError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
