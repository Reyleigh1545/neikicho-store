/**
 * NekiCho - Store Constants & Configuration
 * 
 * Vietnam E-Commerce Settings:
 * - Currency: VND (Vietnamese Dong) stored as integer.
 * - Flat delivery fee: 30,000 VND.
 * - Free delivery threshold: 500,000 VND.
 */

export const SHOP_CONFIG = {
  currency: "VND",
  currencySymbol: "₫",
  defaultShippingFee: 30000, // 30,000 VND
  freeShippingThreshold: 500000, // 500,000 VND
  brandName: "NekiCho",
  brandTagline: "Handcrafted Gift Boxes & Curated Delights",
} as const;

/**
 * Format integer VND amounts to Vietnamese locale string (e.g. 220000 -> "220.000 ₫")
 */
export function formatVND(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 ₫";
  }
  return `${Math.round(amount).toLocaleString("vi-VN")} ₫`;
}

/**
 * Compute shipping fee on the server based on subtotal
 */
export function calculateShippingFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= SHOP_CONFIG.freeShippingThreshold
    ? 0
    : SHOP_CONFIG.defaultShippingFee;
}

