"use client";

import React from "react";
import Link from "next/link";
import { Gift, ChevronRight } from "lucide-react";
import NekiImage from "@/components/ui/NekiImage";
import { getProductAsset } from "@/config/images";
import { formatVND } from "@/config/shop";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageKey?: string | null;
  category?: {
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
  boxCompatible?: boolean;
  stock?: number;
}

export default function ProductCard({
  name,
  slug,
  description,
  price,
  imageKey,
  category,
  boxCompatible = true,
  stock = 20,
}: ProductCardProps) {
  const asset = getProductAsset(imageKey, name, category?.name || "Gift");
  const isGiftSet = category?.slug === "gift-sets";
  // First line of the description only (descriptions are multi-line)
  const shortDescription = (description || "").split("\n")[0];

  return (
    <div className="group relative bg-white rounded-3xl p-3.5 border border-nekicho-border/70 hover:border-nekicho-light/80 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between">
      <div>
        <Link
          href={`/products/${slug}`}
          className="block relative rounded-2xl overflow-hidden bg-nekicho-bg border border-nekicho-subtle/50 mb-3.5 aspect-square"
        >
          <NekiImage
            src={asset.src}
            alt={asset.alt || name}
            category={category?.name}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {category && (
              <span className="text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-nekicho-dark px-2.5 py-1 rounded-full shadow-xs">
                {category.name}
              </span>
            )}
            {boxCompatible && !isGiftSet && (
              <span className="text-[10px] font-bold bg-nekicho-primary/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-1 w-max">
                <Gift className="w-2.5 h-2.5" />
                <span>Cho vào hộp được</span>
              </span>
            )}
          </div>

          {stock === 0 && (
            <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold bg-gray-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              Hết hàng
            </span>
          )}
        </Link>

        <div className="px-1.5">
          <Link href={`/products/${slug}`}>
            <h3 className="font-bold text-sm text-nekicho-text group-hover:text-nekicho-primary transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-nekicho-muted line-clamp-2 mt-1 leading-relaxed">
            {shortDescription}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-nekicho-subtle/60 flex items-center justify-between px-1.5">
        <div>
          <span className="text-xs text-nekicho-muted block font-medium">
            {isGiftSet ? "Từ" : "Giá"}
          </span>
          <span className="text-base font-extrabold text-nekicho-primary">
            {formatVND(price)}
          </span>
        </div>

        <Link
          href={`/products/${slug}`}
          className="px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300 flex items-center justify-center space-x-1 shadow-xs bg-nekicho-subtle hover:bg-nekicho-primary text-nekicho-primary hover:text-white"
          aria-label={`Chọn ${name}`}
        >
          <ChevronRight className="w-4 h-4" />
          <span>Chọn</span>
        </Link>
      </div>
    </div>
  );
}
