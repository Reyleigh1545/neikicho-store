/**
 * NekiCho - Centralized Asset & Image Configuration
 * 
 * IMPORTANT FOR TEAM COLLABORATION:
 * When team members deliver final product photography or visual assets:
 * 1. Drop the image file into `public/images/products/` (or corresponding folder)
 * 2. Update the corresponding path in the dictionaries below.
 * 
 * The application will automatically use these paths throughout all components,
 * catalogs, cart, gift box builder, and admin panels.
 */

export interface ProductAsset {
  src: string;
  alt: string;
  gallery?: string[];
}

export interface GiftBoxAsset {
  src: string;
  alt: string;
  colorHex?: string;
}

export const BRAND_ASSETS = {
  logo: {
    src: "/images/brand/logo.svg",
    alt: "NekiCho Logo",
    fallbackText: "NekiCho",
  },
  heroBanner: {
    src: "/images/brand/hero-banner.jpg",
    alt: "NekiCho Handcrafted Gift Boxes & Delights",
  },
  giftBoxHero: {
    src: "/images/brand/box-builder-hero.jpg",
    alt: "Build Your Custom Gift Box",
  },
};

/**
 * Category Visual Assets
 */
export const CATEGORY_IMAGES: Record<string, { src: string; alt: string }> = {
  "gift-sets": { src: "/images/products/box-open-full.jpg", alt: "Hộp quà NekiCho" },
  "thermal-cups": { src: "/images/products/set-cups.jpg", alt: "Ly giữ nhiệt" },
  "thermal-bottles": { src: "/images/products/set-bottles.jpg", alt: "Bình giữ nhiệt" },
  "scented-candles": { src: "/images/products/set-candles.jpg", alt: "Nến thơm" },
  "wax-flowers": { src: "/images/products/set-wax-flowers.jpg", alt: "Hoa sáp" },
  "wool-scarves": { src: "/images/products/set-scarves.jpg", alt: "Khăn len" },
  "socks": { src: "/images/products/set-socks.jpg", alt: "Tất cotton" },
};

/**
 * Product Image Registry
 * All photos are AI-generated illustration mockups of the concept (not real product photos).
 */
export const PRODUCT_IMAGES: Record<string, ProductAsset> = {
  "box-open-full": { src: "/images/products/box-open-full.jpg", alt: "Hộp quà NekiCho mở nắp với các món bên trong (ảnh minh họa)" },
  "box-closed": { src: "/images/products/box-closed.jpg", alt: "Hộp quà NekiCho đóng nắp (ảnh minh họa)" },
  "box-open-empty": { src: "/images/products/box-open-empty.jpg", alt: "Hộp quà NekiCho rỗng (ảnh minh họa)" },
  "set-cups": { src: "/images/products/set-cups.jpg", alt: "Ly giữ nhiệt màu đỏ đô và xanh rêu (ảnh minh họa)" },
  "set-bottles": { src: "/images/products/set-bottles.jpg", alt: "Bình giữ nhiệt quai xách màu đỏ đô và xanh rêu (ảnh minh họa)" },
  "set-candles": { src: "/images/products/set-candles.jpg", alt: "Bốn hũ nến thơm (ảnh minh họa)" },
  "set-wax-flowers": { src: "/images/products/set-wax-flowers.jpg", alt: "Bó hoa sáp (ảnh minh họa)" },
  "set-scarves": { src: "/images/products/set-scarves.jpg", alt: "Khăn len đỏ đô và xanh rêu (ảnh minh họa)" },
  "set-socks": { src: "/images/products/set-socks.jpg", alt: "Tất cotton đen và trắng (ảnh minh họa)" },
};

/**
 * Custom Gift Box Builder Assets
 */
export const GIFT_BOX_ASSETS = {
  boxes: {
    "box-closed": { src: "/images/products/box-closed.jpg", alt: "Hộp quà NekiCho", colorHex: "#F7C9D9" },
    "box-open-empty": { src: "/images/products/box-open-empty.jpg", alt: "Hộp quà NekiCho cỡ lớn", colorHex: "#F39ABD" },
  } as Record<string, GiftBoxAsset>,
  ribbons: {} as Record<string, GiftBoxAsset>,
  cards: {} as Record<string, GiftBoxAsset>,
};

/**
 * Generate a pastel SVG placeholder data URL when the physical asset file
 * hasn't been uploaded yet by teammates.
 */
export function getPastelPlaceholder(title: string, category: string = "Gift"): string {
  const safeTitle = (title || "NekiCho Item").replace(/[<>&"']/g, "");
  const safeCategory = (category || "Curated").toUpperCase().replace(/[<>&"']/g, "");
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="pastelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF3F7" />
        <stop offset="50%" stop-color="#FCE7EF" />
        <stop offset="100%" stop-color="#F39ABD" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#A51F5E" flood-opacity="0.12"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="600" height="600" fill="url(#pastelGrad)" />
    
    <!-- Decorative Floating Shapes -->
    <circle cx="120" cy="100" r="70" fill="#FFFFFF" fill-opacity="0.35" />
    <circle cx="500" cy="480" r="90" fill="#FFFFFF" fill-opacity="0.3" />
    <path d="M 480 120 C 510 80, 540 100, 520 140 C 500 180, 450 150, 480 120 Z" fill="#E33D7D" fill-opacity="0.15" />
    
    <!-- Center Card -->
    <rect x="100" y="140" width="400" height="320" rx="24" fill="#FFFFFF" fill-opacity="0.88" filter="url(#shadow)" />
    
    <!-- Gift Icon Illustration -->
    <g transform="translate(260, 190)">
      <rect x="0" y="24" width="80" height="64" rx="8" fill="#E33D7D" />
      <rect x="24" y="24" width="32" height="64" fill="#F39ABD" />
      <rect x="-6" y="12" width="92" height="18" rx="6" fill="#A51F5E" />
      <!-- Bow -->
      <path d="M 28 12 C 16 -6, 2 -2, 14 12 Z" fill="#F39ABD" />
      <path d="M 52 12 C 64 -6, 78 -2, 66 12 Z" fill="#F39ABD" />
      <circle cx="40" cy="12" r="6" fill="#A51F5E" />
    </g>

    <!-- Labels -->
    <text x="300" y="330" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="#E33D7D" text-anchor="middle">
      ${safeCategory}
    </text>
    
    <text x="300" y="375" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="#3B1828" text-anchor="middle">
      ${safeTitle}
    </text>
    
    <text x="300" y="415" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#8C5870" text-anchor="middle">
      NekiCho • Student project – E-Business, Hanoi University
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resolver for any product image key. Returns registered path or graceful placeholder.
 */
export function getProductAsset(imageKey: string | null | undefined, fallbackName: string = "Product", category: string = "Gift"): { src: string; alt: string } {
  if (imageKey && PRODUCT_IMAGES[imageKey]) {
    return PRODUCT_IMAGES[imageKey];
  }
  return {
    src: getPastelPlaceholder(fallbackName, category),
    alt: fallbackName,
  };
}

