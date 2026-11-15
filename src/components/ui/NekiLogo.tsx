"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NekiLogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function NekiLogo({
  className = "h-12 w-auto",
  showTagline = true,
}: NekiLogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <Link href="/" className="inline-flex items-center space-x-2 group">
      {!useFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/brand/logo.svg"
          alt="NekiCho Official Brand Logo"
          className={`${className} transition-transform group-hover:scale-105 duration-300`}
          onError={() => setUseFallback(true)}
        />
      ) : (
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tight text-nekicho-text font-serif">
            Neki<span className="text-nekicho-primary">Cho</span>
          </span>
          {showTagline && (
            <span className="text-xs font-bold tracking-widest text-nekicho-muted uppercase">
              Handcrafted Gifts
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

