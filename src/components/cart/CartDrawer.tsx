"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, Gift, ShoppingBag, ArrowRight } from "lucide-react";
import NekiImage from "@/components/ui/NekiImage";
import { getProductAsset } from "@/config/images";
import { formatVND, SHOP_CONFIG } from "@/config/shop";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItemsCount,
    subtotal,
    shippingFee,
    grandTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = SHOP_CONFIG.freeShippingThreshold;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-nekicho-border">
          {/* Header */}
          <div className="p-5 border-b border-nekicho-subtle bg-nekicho-bg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-nekicho-primary" />
              <h2 className="text-lg font-bold text-nekicho-text">
                Giỏ hàng ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-nekicho-muted hover:text-nekicho-primary rounded-full hover:bg-white transition"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-nekicho-cream px-5 py-3 border-b border-nekicho-subtle">
            <div className="text-xs text-nekicho-muted mb-1 flex justify-between font-medium">
              <span>
                {remainingForFree === 0
                  ? "Đơn của bạn được miễn phí giao hàng"
                  : `Thêm ${formatVND(remainingForFree)} để được miễn phí giao hàng`}
              </span>
              <span>{progressToFreeShipping}%</span>
            </div>
            <div className="w-full h-1.5 bg-nekicho-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-nekicho-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-nekicho-muted">
                <div className="w-16 h-16 rounded-full bg-nekicho-subtle flex items-center justify-center mb-4 text-nekicho-primary">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-nekicho-text text-lg mb-1">
                  Giỏ hàng đang trống
                </h3>
                <p className="text-sm mb-6 max-w-xs">
                  Chọn một trong 3 hộp quà làm sẵn, hoặc tự ghép hộp.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Link
                    href="/gift-sets"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2.5 px-4 bg-nekicho-primary hover:bg-nekicho-dark text-white rounded-full text-sm font-semibold transition text-center shadow-soft"
                  >
                    Xem 3 hộp quà
                  </Link>
                  <Link
                    href="/custom-box"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2.5 px-4 bg-nekicho-subtle hover:bg-nekicho-light/30 text-nekicho-primary rounded-full text-sm font-semibold transition text-center"
                  >
                    Tự ghép hộp
                  </Link>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-nekicho-cream/70 border border-nekicho-border flex gap-3 relative transition hover:border-nekicho-light"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-nekicho-subtle">
                    {item.isCustomBox ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-nekicho-subtle text-nekicho-primary p-2 text-center">
                        <Gift className="w-7 h-7 mb-1" />
                        <span className="text-xs font-bold tracking-tight uppercase">Hộp tự ghép</span>
                      </div>
                    ) : (
                      <NekiImage
                        src={getProductAsset(item.imageKey, item.name).src}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-semibold text-sm text-nekicho-text">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-nekicho-muted hover:text-red-500 transition p-1"
                          title="Xoá"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Custom Box Breakdown */}
                      {item.isCustomBox && item.boxDetails && (
                        <div className="mt-1 text-xs text-nekicho-muted space-y-0.5">
                          <p className="truncate">🎀 Ruy băng: {item.boxDetails.ribbonName || "không"}</p>
                          <p className="truncate">💌 Thiệp: {item.boxDetails.cardName || "không"}</p>
                          <p className="text-xs text-nekicho-primary font-medium">
                            {item.boxDetails.items.length} món trong hộp
                          </p>
                        </div>
                      )}

                      <p className="text-sm font-bold text-nekicho-primary mt-1">
                        {formatVND(item.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-nekicho-subtle/60">
                      <div className="flex items-center space-x-2 bg-white rounded-lg border border-nekicho-border px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-nekicho-muted hover:text-nekicho-primary p-0.5"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-nekicho-text min-w-[1.2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-nekicho-muted hover:text-nekicho-primary p-0.5"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-nekicho-text">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-nekicho-border bg-nekicho-bg space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-nekicho-muted">
                  <span>Tạm tính</span>
                  <span className="font-medium text-nekicho-text">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-nekicho-muted">
                  <span>Phí giao hàng (nội thành HN)</span>
                  <span className="font-medium text-nekicho-text">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">Miễn phí</span>
                    ) : (
                      formatVND(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-nekicho-text pt-2 border-t border-nekicho-subtle">
                  <span>Tổng cộng</span>
                  <span className="text-nekicho-primary">{formatVND(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 bg-nekicho-primary hover:bg-nekicho-dark text-white rounded-full font-bold flex items-center justify-center space-x-2 transition shadow-soft hover:shadow-elevated"
              >
                <span>Thanh toán</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

